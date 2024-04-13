import { Plugin, TFile, Notice } from 'obsidian';

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class ColorTheLeaves extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        await this.loadSettings();

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
            // Called when the user clicks the icon.
            new Notice('This is a notice!');
        });
        // Perform additional things with the ribbon
        ribbonIconEl.addClass('my-plugin-ribbon-class');

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText('Status Bar Text');

        this.addCommand({
            id: 'add-tag-to-leaves',
            name: 'Add Tag to Leaves',
            callback: () => {
                this.addTagToLeaves('#leaf');
            }
        });


        this.addCommand({
            id: 'remove-all-tags',
            name: 'Remove All Tags',
            callback: () => {
                this.removeAllTags();
            }
        });
    }

    addTagToLeaves(tagName: string) {
        const leafNotes = this.findLeafNotes();
        leafNotes.forEach(note => {
            this.addTagToNote(note, tagName);
        });
    }

    findLeafNotes(): TFile[] {
        const leafNotes: TFile[] = [];
        const allNotes = this.app.vault.getMarkdownFiles();
        allNotes.forEach(note => {
            if (this.getOutgoingLinks(note).length === 0) {
                leafNotes.push(note);
            }
        });
        return leafNotes;
    }

	getOutgoingLinks(note: TFile): string[] {
        const outgoingLinks: string[] = [];
        const content = this.app.vault.cachedRead(note);

        // Regular expression to match links in Markdown format: [link text](file path)
        const linkRegex = /\[.*?\]\((.*?)\)/g;
        let match;

        // Find all outgoing links in the note's content
        while ((match = linkRegex.exec(content)) !== null) {
            // Extract the link target
            const linkTarget = match[1];
            outgoingLinks.push(linkTarget);
        }

        return outgoingLinks;
    }

    async addTagToNote(note: TFile, tagName: string) {
        let content = await this.app.vault.read(note);
        content += `\n${tagName}`;
        await this.app.vault.modify(note, content);
    }

    async removeAllTags() {
        const allFiles = this.app.vault.getMarkdownFiles();
        allFiles.forEach(async (file) => {
            let content = await this.app.vault.read(file);
            content = this.removeTags(content);
            await this.app.vault.modify(file, content);
        });
    }

    removeTags(content: string): string {
        // Regular expression to match tags
        const tagRegex = /#\w+/g;
        return content.replace(tagRegex, '').trim();
    }


    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {

    }
}

