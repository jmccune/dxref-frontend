// ==================================================================
// DXREF ERROR
// ==================================================================

export default function DxrefError(message) {
  this.name = 'DxrefError';
  this.message = message || 'DxrefError Error <Unknown>';
}
DxrefError.prototype = Object.create(DxrefError.prototype);
DxrefError.prototype.constructor = DxrefError;
