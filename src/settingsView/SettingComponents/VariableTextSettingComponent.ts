import { AbstractSettingComponent } from './AbstractSettingComponent';
import { debounce, Setting, TextComponent } from 'obsidian';
import { resetTooltip, VariableText } from '../../SettingHandlers';
import { sanitizeText } from '../../Utils';
import { t } from '../../lang/helpers';

export class VariableTextSettingComponent extends AbstractSettingComponent {
	textComponent: TextComponent;

	setting: VariableText;

	render(containerEl: HTMLElement): void {
		if (typeof this.setting.default !== 'string') {
			return console.error(
				`${t('Error:')} ${this.setting.title} ${t('missing default value')}`
			);
		}

		this.settingEl = new Setting(containerEl);
		this.createTitle();
		this.createDescription(this.setting.default);

		this.settingEl.addText((text) => {
			let value = this.settingsManager.getSetting(
				this.sectionId,
				this.setting.id
			);

			const onChange = debounce(
				(value: string) => {
					this.settingsManager.setSetting(
						this.sectionId,
						this.setting.id,
						sanitizeText(value)
					);
				},
				250,
				true
			);

			if (this.setting.quotes && value === `""`) {
				value = ``;
			}

			text.setValue(value ? value.toString() : this.setting.default);
			text.onChange(onChange);

			this.textComponent = text;
		});

		this.settingEl.addExtraButton((b) => {
			b.setIcon('reset');
			b.onClick(() => {
				this.textComponent.setValue(this.setting.default);
				this.settingsManager.clearSetting(this.sectionId, this.setting.id);
			});
			b.setTooltip(resetTooltip);
		});

		this.settingEl.settingEl.dataset.id = this.setting.id;
	}

	destroy(): void {
		this.settingEl?.settingEl.remove();
	}
}
