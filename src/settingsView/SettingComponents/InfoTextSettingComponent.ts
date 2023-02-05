import { AbstractSettingComponent } from './AbstractSettingComponent';
import { Setting } from 'obsidian';
import { InfoText } from '../../SettingHandlers';

export class InfoTextSettingComponent extends AbstractSettingComponent {
	setting: InfoText;

	render(containerEl: HTMLElement): void {
		this.settingEl = new Setting(containerEl);
		this.settingEl.setClass('style-settings-info-text');

		this.createTitle();
		this.createDescription();

		this.settingEl.settingEl.dataset.id = this.setting.id;
	}

	destroy(): void {
		this.settingEl?.settingEl.remove();
	}
}
