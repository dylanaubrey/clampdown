/**
 *
 * Clampdown
 */
export default class Clampdown {
  /**
   *
   * @constructor
   * @param {Element} element
   * @return {Clampdown}
   */
  constructor(element) {
    const message = 'Clampdown::constructor::The element param is not a valid HTML Element';
    if (!(element instanceof Element)) this._setError(message);
    if (this._errors.length) return;
    this._element = element;
    this._target = element.firstElementChild;
    this._targetText = this._target.innerText;
  }

  /**
   *
   * @private
   * @type {boolean}
   */
  _clamp = false;

  /**
   *
   * @private
   * @type {boolean}
   */
  _clamped = false;

  /**
   *
   * @private
   * @type {Array<string>}
   */
  _errors = [];

  /**
   *
   * @private
   * @type {Object}
   */
  _lineClampStyles = {
    height: '',
    webkitLineClamp: '',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  /**
   *
   * @private
   * @type {boolean}
   */
  _lineClampSupport = false;

  /**
   *
   * @return {Array<string>}
   */
  get errors() {
    return this._errors;
  }

  /**
   *
   * @param {Object} [opts]
   * @param {number} [opts.buffer]
   * @param {number} [opts.ratio]
   * @return {void}
   */
  _calc({ buffer = 0.5, ratio = 0.5 } = {}) {
    if (this._errors.length) return;
    const parentHeight = this._element.clientHeight;
    this._targetHeight = this._target.clientHeight;
    this._clamp = parentHeight < this._targetHeight;
    if (!this._clamp) return;
    const styles = getComputedStyle(this._target);
    const lineHeight = this._parseStyle(styles.lineHeight);
    this._lineCount = Math.floor(parentHeight / lineHeight);
    this._lineClampSupport = !!styles.webkitLineClamp;
    if (this._lineClampSupport) return;
    const fontSize = this._parseStyle(styles.fontSize);
    const charWidth = Math.ceil(fontSize * ratio);
    const targetWidth = this._target.clientWidth;
    const charPerLine = Math.floor(targetWidth / charWidth);
    const charBuffer = Math.floor(charPerLine * buffer);
    this._charLimit = Math.floor((this._lineCount * charPerLine) - charBuffer);
  }

  /**
   *
   * @private
   * @return {void}
   */
  _clampTarget() {
    this._target.innerText = this._targetText.substring(0, this._charLimit);
    this._target.classList.add('line-clamped');
  }

  /**
   *
   * @private
   * @param {string} style
   * @return {number}
   */
  _parseStyle(style) {
    return style.replace(/px/, '');
  }

  /**
   *
   * @private
   * @return {void}
   */
  _remove() {
    if (this._errors.length || !this._clamp) return;
    this._element.classList.remove('clampdown');

    if (this._lineClampSupport) {
      this._unstyleTarget();
      return;
    }

    this._unclampTarget();
    this._clamp = false;
    this._clamped = false;
  }

  /**
   *
   * @private
   * @return {void}
   */
  _set() {
    if (this._errors.length || !this._clamp) return;
    this._element.classList.add('clampdown');

    if (this._lineClampSupport) {
      this._styleTarget();
      return;
    }

    this._clampTarget();
    this._clamped = true;
  }

  /**
   *
   * @private
   * @param {string} message
   * @return {void}
   */
  _setError(message) {
    this._errors.push(message);
  }

  /**
   *
   * @private
   * @return {void}
   */
  _styleTarget() {
    const styles = { ...this._lineClampStyles };
    styles.height = `${this._targetHeight}px`;
    styles.webkitLineClamp = this._lineCount;

    Object.keys(styles).forEach((key) => {
      this._target.style.setProperty(key, styles[key]);
    });
  }

  /**
   *
   * @private
   * @return {void}
   */
  _unclampTarget() {
    this._target.innerText = this._targetText;
    this._target.classList.remove('line-clamped');
  }

  /**
   *
   * @private
   * @return {void}
   */
  _unstyleTarget() {
    const styles = { ...this._lineClampStyles };

    Object.keys(styles).forEach((key) => {
      this._target.style.removeProperty(key);
    });
  }

  /**
   *
   * @param {Object} opts
   * @return {void}
   */
  clamp(opts) {
    this._calc(opts);
    this._set();
  }

  /**
   *
   * @param {Object} opts
   * @return {void}
   */
  reclamp(opts) {
    if (this._lineClampSupport) return;
    this._unclampTarget();
    this._calc(opts);
    this._set();
  }

  /**
   *
   * @return {void}
   */
  unclamp() {
    this._remove();
  }
}
