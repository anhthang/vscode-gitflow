'use strict'

import * as vscode from 'vscode'

// Minimal shape of the vscode.git extension API surface we use.
interface GitRepository {
    rootUri: vscode.Uri
    state: { HEAD?: { name?: string } }
}

interface GitAPI {
    readonly repositories: GitRepository[]
    getRepository(uri: vscode.Uri): GitRepository | null
}

interface GitExtension {
    getAPI(version: 1): GitAPI
}

let cachedApi: GitAPI | undefined

async function getGitAPI(): Promise<GitAPI | undefined> {
    if (cachedApi) {
        return cachedApi
    }
    const ext = vscode.extensions.getExtension<GitExtension>('vscode.git')
    if (!ext) {
        return undefined
    }
    const api = ext.isActive ? ext.exports : await ext.activate()
    cachedApi = api.getAPI(1)
    return cachedApi
}

/**
 * Resolve which repository (or submodule) the next gitflow command should target.
 *
 * Resolution order:
 *   1. Repository owning the currently focused editor.
 *   2. Single repository workspace, that one.
 *   3. QuickPick over all known repositories and submodules.
 *
 * Returns undefined if the user cancels the picker or no repos exist.
 */
export async function resolveActiveRepository(): Promise<GitRepository | undefined> {
    const api = await getGitAPI()
    if (!api || api.repositories.length === 0) {
        vscode.window.showErrorMessage(
            'GitFlow: no git repository was detected in the workspace.'
        )
        return undefined
    }

    // 1. Editor-based resolution. vscode.git registers each submodule as its
    //    own repository, so this Just Works for submodules.
    const activeUri = vscode.window.activeTextEditor?.document.uri
    if (activeUri && activeUri.scheme === 'file') {
        const repo = api.getRepository(activeUri)
        if (repo) {
            return repo
        }
    }

    // 2. Unambiguous single repo.
    if (api.repositories.length === 1) {
        return api.repositories[0]
    }

    // 3. Multiple candidates. Ask.
    type Item = vscode.QuickPickItem & { repo: GitRepository }
    const items: Item[] = api.repositories.map((repo) => {
        const folder = vscode.workspace.getWorkspaceFolder(repo.rootUri)
        const branch = repo.state.HEAD?.name ?? 'detached'
        const label = folder
            ? folder.uri.fsPath === repo.rootUri.fsPath
                ? `$(repo) ${folder.name}`
                : `$(repo) ${folder.name} / ${vscode.workspace.asRelativePath(repo.rootUri, false)}`
            : `$(repo) ${repo.rootUri.fsPath}`
        return {
            label,
            description: branch,
            detail: repo.rootUri.fsPath,
            repo,
        }
    })

    const picked = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a repository or submodule for this gitflow command',
        matchOnDetail: true,
    })
    return picked?.repo
}
