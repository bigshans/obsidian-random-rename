import { Plugin, TAbstractFile, TFile, TFolder } from 'obsidian';

function isFile(file: TAbstractFile): file is TFile {
    return !('children' in file);
}

function isFolder(file: TAbstractFile): file is TFolder {
    return 'children' in file;
}

export default class MyPlugin extends Plugin {
    onload(): void {
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu, file) => {
                menu.addItem((item) => {
                    item
                    .setIcon('pen-line')
                    .setTitle('Random Rename: Append Random Suffix')
                    .onClick(() => {
                        let path = file.path;
                        if (isFile(file)) {
                            const parentPath = file.parent!.path.endsWith('/') ? file.parent!.path : `${file.parent!.path}/`
                            path = `${parentPath}${file.basename}-${Date.now()}.${file.extension}`
                        } else {
                            if (path !== '/') {
                                path = `${path}-${Date.now()}`
                            }
                        }
                        if (path !== '/') {
                            this.app.fileManager.renameFile(file, path);
                        }
                    });
                });

                if (isFolder(file)) {
                    menu.addItem((item) => {
                        item
                        .setIcon('file-plus')
                        .setTitle('Random Rename: New Random Note')
                        .onClick(() => {
                            if (!isFolder(file)) {
                                return
                            }
                            let path = file.path;
                            if (file.isRoot()) {
                                path = `/${Date.now()}.md`
                            } else {
                                path = `${path}/${file.name}-${Date.now()}.md`
                            }
                            this.app.vault.create(path, '');
                        });
                    })
                    menu.addItem((item) => {
                        item
                        .setIcon('file-plus')
                        .setTitle('Random Rename: New Note by Folder Name')
                        .onClick(() => {
                            if (!isFolder(file)) {
                                return
                            }
                            let path = file.path;
                            if (file.isRoot()) {
                                path = `/${this.app.vault.getName()}.md`
                            } else {
                                path = `${path}/${file.name}.md`
                            }
                            this.app.vault.create(path, '');
                        });
                    })
                }

            })
        );
    }
}
