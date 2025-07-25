import * as vscode from 'vscode'
import { config } from './config'
import { fail } from './fail'

export interface CardInputResult {
  cardId: string
  name: string
}

export interface ParentCardInfo {
  cardId: string
  featureName: string
}

export class CardIntegration {
  /**
   * Validate if the template has required placeholders
   */
  static validateTemplate(template: string): boolean {
    return template.includes('{type}') && template.includes('{name}')
  }

  /**
   * Validate card ID against configured regex
   */
  static validateCardId(cardId: string): boolean {
    if (!config.cardIntegrationRequired && !cardId) {
      return true // Optional and empty is OK
    }

    const regex = new RegExp(config.cardIntegrationValidation)
    return regex.test(cardId)
  }

  /**
   * Extract parent card information from feature branch name
   */
  static extractParentCardInfo(featureBranchName: string): ParentCardInfo {
    const prefix = config.cardIntegrationPrefix

    if (!prefix) {
      // No prefix configured, try to extract feature name only
      const featureName = featureBranchName.replace(/^feature\//, '')
      return { cardId: '', featureName }
    }

    // Pattern: feature/PREFIX123456-feature-name
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`${escapedPrefix}([^-]+)-(.+)`)
    const match = featureBranchName.match(pattern)

    if (match) {
      return {
        cardId: match[1],        // 123456
        featureName: match[2]    // feature-name
      }
    }

    // Fallback for features without card
    const featureName = featureBranchName.replace(/^feature\//, '')
    return { cardId: '', featureName }
  }

  /**
   * Format branch name using template
   */
  static formatBranchName(
    type: string,
    cardId: string,
    name: string,
    parentFeature?: string,
    parentCardId?: string
  ): string {
    let template = config.cardIntegrationFormat

    // Validate template
    if (!this.validateTemplate(template)) {
      // Fallback to simple format if template is invalid
      template = '{type}/{name}'
    }

    // For tasks, modify template automatically to include parent feature
    if (type === 'task' && parentFeature && parentCardId) {
      template = this.createTaskTemplate(template, parentFeature, parentCardId)
    }

    // Apply template
    return this.applyTemplate(template, {
      type,
      prefix: config.cardIntegrationPrefix,
      cardId,
      name,
      parentFeature,
      parentCardId
    })
  }

  /**
   * Create task template with parent feature information
   */
  private static createTaskTemplate(
    userTemplate: string,
    parentFeature: string,
    parentCardId: string
  ): string {
    const prefix = config.cardIntegrationPrefix

    // Build parent part
    const parentPart = parentCardId
      ? `${prefix}${parentCardId}-${parentFeature}`
      : parentFeature

    // Insert parent part after {type}
    return userTemplate.replace('{type}', `{type}/${parentPart}`)
  }

  /**
   * Apply template with given values
   */
  private static applyTemplate(template: string, values: any): string {
    let result = template

    // Replace all placeholders
    Object.keys(values).forEach(key => {
      if (values[key] !== undefined && values[key] !== null) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), values[key])
      }
    })

    // Clean up any remaining empty prefixes or double separators
    result = result.replace(/\/+/g, '/') // Multiple slashes to single
    result = result.replace(/-+/g, '-')  // Multiple dashes to single
    result = result.replace(/\/-/g, '/') // Slash-dash to slash
    result = result.replace(/-\//g, '/') // Dash-slash to slash

    return result
  }

  /**
   * Show input dialog for card-aware branch creation
   */
  static async showBranchInputDialog(type: string, parentInfo?: ParentCardInfo): Promise<string> {
    if (!config.cardIntegrationEnabled) {
      // Traditional flow
      return await this.showTraditionalInput(type)
    }

    // Card integration flow
    const result = await this.showCardInput(type, parentInfo)

    if (parentInfo) {
      // For tasks, include parent information
      return this.formatBranchName(
        type,
        result.cardId,
        result.name,
        parentInfo.featureName,
        parentInfo.cardId
      )
    } else {
      // For features/hotfix/release
      return this.formatBranchName(type, result.cardId, result.name)
    }
  }

  /**
   * Traditional input for when card integration is disabled
   */
  private static async showTraditionalInput(type: string): Promise<string> {
    const name = await vscode.window.showInputBox({
      placeHolder: `${type}-name`,
      prompt: `Enter the name of the ${type}`,
      validateInput: (value) => {
        if (!value) {
          return `${type} name is required`
        }
        return ''
      }
    })

    if (!name) {
      throw fail.error({ message: `${type} name is required` })
    }

    return name.split(' ').join('-')
  }

  /**
   * Card-aware input dialog
   */
  private static async showCardInput(type: string, parentInfo?: ParentCardInfo): Promise<CardInputResult> {
    const required = config.cardIntegrationRequired
    const prefix = config.cardIntegrationPrefix

    // Show card ID input
    const cardLabel = required ? 'Card ID' : 'Card ID (optional)'
    const cardPlaceholder = prefix ? `Enter number (will become ${prefix}123456)` : 'Enter card ID'

    const cardId = await vscode.window.showInputBox({
      placeHolder: cardPlaceholder,
      prompt: cardLabel,
      validateInput: (value) => {
        if (required && !value) {
          return 'Card ID is required'
        }
        if (value && !this.validateCardId(value)) {
          return 'Card ID format is invalid'
        }
        return ''
      }
    })

    if (required && !cardId) {
      throw fail.error({ message: 'Card ID is required' })
    }

    // Show name input with helpful prompt
    const namePrompt = parentInfo
      ? `Enter the ${type} description (will be added to ${parentInfo.featureName})`
      : `Enter the ${type} description`

    const name = await vscode.window.showInputBox({
      placeHolder: `${type}-description`,
      prompt: namePrompt,
      validateInput: (value) => {
        if (!value) {
          return `${type} description is required`
        }
        // Valid input - return empty string (no error)
        return ''
      }
    })

    if (!name) {
      throw fail.error({ message: `${type} description is required` })
    }

    return {
      cardId: cardId || '',
      name: name.split(' ').join('-')
    }
  }
}
