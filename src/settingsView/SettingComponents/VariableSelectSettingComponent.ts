import { AbstractSettingComponent } from './AbstractSettingComponent';
import { DropdownComponent, Setting } from 'obsidian';
import {
	resetTooltip,
	SelectOption,
	VariableSelect,
} from '../../SettingHandlers';
import { t } from '../../lang/helpers';

export class VariableSelectSettingComponent extends AbstractSettingComponent {
	dropdownComponent: DropdownComponent;

	setting: VariableSelect;

	render(containerEl: HTMLElement): void {
		if (typeof this.setting.default !== 'string') {
			return console.error(
				`${t('Error:')} ${this.setting.title} ${t('missing default value')}`
			);
		}

		const defaultLabel = this.getDefaultOptionLabel();

		this.settingEl = new Setting(containerEl);
		this.createTitle();
		this.createDescription(this.setting.default, defaultLabel);

		this.settingEl.addDropdown((dropdown) => {
			const value = this.settingsManager.getSetting(
				this.sectionId,
				this.setting.id
			);

			for (const o of this.setting.options) {
				if (typeof o === 'string') {
					dropdown.addOption(o, o);
				} else {
					dropdown.addOption(o.value, o.label);
				}
			}

			dropdown.setValue(
				value !== undefined ? (value as string) : this.setting.default
			);
			dropdown.onChange((value) => {
				this.settingsManager.setSetting(this.sectionId, this.setting.id, value);
			});

			this.dropdownComponent = dropdown;
		});

		this.settingEl.addExtraButton((b) => {
			b.setIcon('reset');
			b.onClick(() => {
				this.dropdownComponent.setValue(this.setting.default);
				this.settingsManager.clearSetting(this.sectionId, this.setting.id);
			});
			b.setTooltip(resetTooltip);
		});

		this.settingEl.settingEl.dataset.id = this.setting.id;
	}

	destroy(): void {
		this.settingEl?.settingEl.remove();
	}

	private getDefaultOption(): string | SelectOption | undefined {
		if (this.setting.default) {
			return this.setting.options.find((o) => {
				if (typeof o === 'string') {
					return o === this.setting.default;
				}

				return o.value === this.setting.default;
			});
		}

		return undefined;
	}

	private getDefaultOptionLabel() {
		const defaultOption = this.getDefaultOption();

		if (defaultOption) {
			if (typeof defaultOption === 'string') {
				return defaultOption;
			}
			return defaultOption.label;
		}

		return undefined;
	}
}
