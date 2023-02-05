import { AbstractSettingComponent } from './AbstractSettingComponent';
import { debounce, Setting, TextComponent } from 'obsidian';
import { resetTooltip, VariableNumber } from '../../SettingHandlers';
import { t } from '../../lang/helpers';

export class VariableNumberSettingComponent extends AbstractSettingComponent {
	textComponent: TextComponent;

	setting: VariableNumber;

	render(containerEl: HTMLElement): void {
		if (typeof this.setting.default !== 'number') {
			return console.error(
				`${t('Error:')} ${this.setting.title} ${t('missing default value')}`
			);
		}

		this.settingEl = new Setting(containerEl);
		this.createTitle();
		this.createDescription(this.setting.default.toString(10));

		this.settingEl.addText((text) => {
			const value = this.settingsManager.getSetting(
				this.sectionId,
				this.setting.id
			);
			const onChange = debounce(
				(value: string) => {
					const isFloat = /\./.test(value);
					this.settingsManager.setSetting(
						this.sectionId,
						this.setting.id,
						isFloat ? parseFloat(value) : parseInt(value, 10)
					);
				},
				250,
				true
			);

			text.setValue(
				value !== undefined ? value.toString() : this.setting.default.toString()
			);
			text.onChange(onChange);

			this.textComponent = text;
		});

		this.settingEl.addExtraButton((b) => {
			b.setIcon('reset');
			b.onClick(() => {
				this.textComponent.setValue(this.setting.default.toString());
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
