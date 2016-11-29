'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('underscore');

var RowProperties = (function () {
  function RowProperties() {
    var rowMetadata = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var rowComponent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var isCustom = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, RowProperties);

    this.rowMetadata = rowMetadata;
    this.rowComponent = rowComponent;
    this.isCustom = isCustom;
    // assign unique Id to each griddle instance
    this.gridId = _.uniqueId();
  }

  _createClass(RowProperties, [{
    key: 'getRowKey',
    value: function getRowKey(row, key) {
      var uniqueId;

      if (this.hasRowMetadataKey()) {
        uniqueId = row[this.rowMetadata.key];
      } else {
        uniqueId = 'grid_' + this.gridId + '_row_' + key;
      }

      //todo: add error handling

      return uniqueId;
    }
  }, {
    key: 'hasRowMetadataKey',
    value: function hasRowMetadataKey() {
      return this.hasRowMetadata() && this.rowMetadata.key !== null && this.rowMetadata.key !== undefined;
    }
  }, {
    key: 'getBodyRowMetadataClass',
    value: function getBodyRowMetadataClass(rowData) {
      if (this.hasRowMetadata() && this.rowMetadata.bodyCssClassName !== null && this.rowMetadata.bodyCssClassName !== undefined) {
        if (typeof this.rowMetadata.bodyCssClassName === 'function') {
          return this.rowMetadata.bodyCssClassName(rowData);
        } else {
          return this.rowMetadata.bodyCssClassName;
        }
      }
      return null;
    }
  }, {
    key: 'getHeaderRowMetadataClass',
    value: function getHeaderRowMetadataClass() {
      return this.hasRowMetadata() && this.rowMetadata.headerCssClassName !== null && this.rowMetadata.headerCssClassName !== undefined ? this.rowMetadata.headerCssClassName : null;
    }
  }, {
    key: 'hasRowMetadata',
    value: function hasRowMetadata() {
      return this.rowMetadata !== null;
    }
  }]);

  return RowProperties;
})();

module.exports = RowProperties;
