import { CSSSettingsManager } from '../../SettingsManager';
import { CSSSetting } from '../../SettingHandlers';
import { getDescriptionLocalization, getTitleLocalization } from '../../Utils';
import fuzzysort from 'fuzzysort';
import { MarkdownRenderer, Setting } from 'obsidian';
import { t } from '../../lang/helpers';

export abstract class AbstractSettingComponent {
	sectionId: string;
	sectionName: string;
	setting: CSSSetting;
	settingsManager: CSSSettingsManager;
	isView: boolean;
	settingEl: Setting;

	constructor(
		sectionId: string,
		sectionName: string,
		setting: CSSSetting,
		settingsManager: CSSSettingsManager,
		isView: boolean
	) {
		this.sectionId = sectionId;
		this.sectionName = sectionName;
		this.setting = setting;
		this.settingsManager = settingsManager;
		this.isView = isView;

		this.onInit();
	}

	onInit(): void {}

	/**
	 * Matches the Component against `str`. A perfect match returns 0, no match returns negative infinity.
	 *
	 * @param str the string to match this Component against.
	 */
	match(str: string): number {
		if (!str) {
			return Number.NEGATIVE_INFINITY;
		}

		return Math.max(
			fuzzysort.single(str, getTitleLocalization(this.setting))?.score ??
				Number.NEGATIVE_INFINITY,
			fuzzysort.single(str, getDescriptionLocalization(this.setting))?.score ??
				Number.NEGATIVE_INFINITY
		);
	}

	/**
	 * Matches the Component against `str`. A match returns true, no match  or a bad match returns false.
	 *
	 * @param str the string to match this Component against.
	 */
	decisiveMatch(str: string): boolean {
		return this.match(str) > -100000;
	}

	/**
	 * Renders the Component and all it's children into `containerEl`.
	 *
	 * @param containerEl
	 */
	abstract render(containerEl: HTMLElement): void;

	/**
	 * Destroys the component and all it's children.
	 */
	abstract destroy(): void;

	/**
	 * Adds the settings title to the SettingEl.
	 *
	 * @protected
	 */
	protected createTitle() {
		if (!this.settingEl) {
			return;
		}

		const title = getTitleLocalization(this.setting);

		if (title) {
			this.settingEl.setName(title);
		}
	}

	/**
	 * Adds the settings description to the SettingEL.
	 *
	 * @param defaultValue
	 * @param defaultValueLabel
	 * @protected
	 */
	protected createDescription(
		defaultValue?: string,
		defaultValueLabel?: string
	) {
		if (!this.settingEl || !this.setting) {
			return;
		}

		const fragment: DocumentFragment = createFragment();

		this.populateDescriptionFragment(fragment);

		if (defaultValue) {
			const defaultValueDiv = fragment.createEl('div', {
				cls: 'style-settings-default-value',
			});

			const defaultValueSmall = defaultValueDiv.createEl('small');
			defaultValueSmall.createEl('strong', { text: `${t('Default:')} ` });
			defaultValueSmall.appendChild(
				document.createTextNode(defaultValueLabel || defaultValue)
			);
		}

		this.settingEl.setDesc(fragment);
	}

	/**
	 * Populates a document fragment with the elements description.
	 *
	 * @param fragment
	 * @protected
	 */
	protected populateDescriptionFragment(fragment: DocumentFragment) {
		const description = getDescriptionLocalization(this.setting);

		if (description) {
			if (this.setting.markdown) {
				const markdownParentEl = fragment.createEl('div', {
					cls: 'style-settings-markdown',
				});
				MarkdownRenderer.renderMarkdown(
					description,
					markdownParentEl,
					'',
					undefined
				);
			} else {
				fragment.appendChild(document.createTextNode(description));
			}
		}
	}
}
