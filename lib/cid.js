'use strict';

var base32 = require('base32');
var uuid   = require('node-uuid');
var crypto = require('crypto');
var crc8   = require('crc').buffer.crc8;

var types = {
  INVALID_ID:     0,
  UNIQUE_USER_ID: 85,
  USER_ID:        117,
  SERVER_ID:      83,
  COOKIE_ID:      67,
  CHANNEL_ID:     99,
  MESSAGE_ID:     109,
  PASSWORD_ID:    112
};

function ChatId(id) {
  this._data = new Buffer(21);
  this._data.fill(0);

  if (typeof id === 'string' && id.length == 34) {
    fromBase32(id).copy(this._data);
  }
  else if (Buffer.isBuffer(id) && id.length == 21) {
    id.copy(this._data);
  }
}


ChatId.prototype.toString = function() {
  return toBase32(this._data);
};


ChatId.prototype.type = function() {
  return this._data.readUInt8(20);
};


ChatId.prototype.setType = function(type) {
  this._data.writeUInt8(type || 0, 20);
};


/**
 * Создание идентификатора на основе SHA1 хеша исходных данных.
 *
 * @param data Данные на основе которых будет создан идентификатор.
 * @param type Тип идентификатора.
 */
function create(data, type) {
  var id = new ChatId();
  crypto.createHash('sha1').update(data).digest().copy(id._data);
  id.setType(type);
  return id;
}


function createShort(data) {
  var hash = crypto.createHash('sha1').update(data).digest();
  hash.writeUInt8(crc8(hash), 4);
  hash.writeUInt8(crc8(hash.slice(0, 5)), 5);

  return toBase32(hash.slice(0, 6));
}


/**
 * Генерация случайного идентификатора с типом @p type и опциональной солью @p salt.
 */
function randomId(type, salt) {
  var offset = Buffer.byteLength(salt || '');

  var buf = new Buffer(offset + 16);
  uuid.v4(null, buf, offset);

  if (offset)
    buf.write(salt, 0, offset, 'binary');

  return create(buf, type);
}


function messageId() {
  var buffer = new Buffer(16);
  uuid.v4(null, buffer, 0);

  return base32.encode(buffer);
}


function fromBase32(data) {
  return new Buffer(base32.decode(data), 'binary');
}


function toBase32(data) {
  return base32.encode(data)
}

exports.ChatId      = ChatId;
exports.fromBase32  = fromBase32;
exports.toBase32    = toBase32;
exports.create      = create;
exports.createShort = createShort;
exports.randomId    = randomId;
exports.messageId   = messageId;
exports.types       = types;
