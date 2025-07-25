import * as vscode from 'vscode'

class ConfigReader {
    private _readConfig<T>(key: string, default_: T): T {
        const val = vscode.workspace.getConfiguration('gitflow').get<T>(key)
        if (val === undefined) {
            return default_
        }
        return val
    }

    get squashFeatureDuringMerge(): boolean {
        return this._readConfig<boolean>('squashFeatureDuringMerge', false)
    }

    get deleteBranchOnFinish(): boolean {
        return this._readConfig<boolean>('deleteBranchOnFinish', true)
    }

    get deleteRemoteBranches(): boolean {
        return this._readConfig<boolean>('deleteRemoteBranches', true)
    }

    get requireSync(): boolean {
        return this._readConfig<boolean>('requireSync', false)
    }

    get allowOfflineWork(): boolean {
        return this._readConfig<boolean>('allowOfflineWork', true)
    }

    get default_development(): string {
        return this._readConfig<string>('default.development', 'develop')
    }

    get default_production(): string {
        return this._readConfig<string>('default.production', 'master')
    }

    get default_task(): string {
        return this._readConfig<string>('default.task', 'task')
    }
}

export const config = new ConfigReader()
