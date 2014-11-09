var cid    = require('../index');
var expect = require('chai').expect;
var crc8   = require('crc').crc8;

describe('Create new', function() {
  it('Should create new id from correct string', function() {
    var id = new cid.ChatId('MO3SFNVQDUNE3YPQ7XLDFZZUSM3IYWTCOU');

    expect(id.type()).to.deep.equal(cid.types.USER_ID);
    expect(id.toString()).to.deep.equal('MO3SFNVQDUNE3YPQ7XLDFZZUSM3IYWTCOU');
  });


  it('Should create new id from buffer', function() {
    var id = new cid.ChatId(new Buffer('63b722b6b01d1a4de1f0fdd632e73493368c5a6275', 'hex'));

    expect(id.type()).to.deep.equal(cid.types.USER_ID);
    expect(id.toString()).to.deep.equal('MO3SFNVQDUNE3YPQ7XLDFZZUSM3IYWTCOU');
  });


  it('Should create invalid id in other cases', function() {

    var tests = [
      undefined,
      '',
      '1O3-FNVQDUNE3Y-Q7XLDFZZ+SM31YWTCOU'
    ];

    var id;

    for (var i = 0; i < tests.length; ++i) {
      id = new cid.ChatId(tests[i]);

      expect(id.type()).to.deep.equal(cid.types.INVALID_ID);
      expect(id.toString()).to.deep.equal('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    }
  });
});


describe('Generate', function() {
  it('Should create new id from exists data', function() {
    var id = cid.create('SECRET', cid.types.CHANNEL_ID);

    expect(id).to.be.an.instanceof(cid.ChatId);
    expect(id.type()).to.deep.equal(cid.types.CHANNEL_ID);
    expect(id.toString()).to.deep.equal('HQ5SOTIRT722L3DMDYQVYHFXSTMZOOWBMM');
  });


  it('Should generate random id', function() {
    var id = cid.randomId(cid.types.CHANNEL_ID);

    expect(id).to.be.an.instanceof(cid.ChatId);
    expect(id.type()).to.deep.equal(cid.types.CHANNEL_ID);
  });
});


describe('Create short ids', function() {
  it('Should create new short id from exists data', function() {
    var id = cid.createShort('SOME SECRET');

    expect(id).to.deep.equal('RDK6KFWMUA');

    var buf = cid.fromBase32(id);
    expect(buf.readUInt8(5)).to.deep.equal(crc8(buf.slice(0, 5)));
  });
});