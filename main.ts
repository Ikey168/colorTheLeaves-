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
        // Logic to retrieve outgoing links from a note
        // You might need to use regular expressions or a Markdown parser for this
        return [];
    }

    async addTagToNote(note: TFile, tagName: string) {
        let content = await this.app.vault.read(note);
        content += `\n${tagName}`;
        await this.app.vault.modify(note, content);
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

