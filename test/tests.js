
var i18n = require('../')
  , expect = require('chai').expect;

describe('i18n', function () {
  var intn, logged;
  beforeEach(function(){
    logged = 0;
    intn = new i18n.LocaleManager('test', {log: function(){logged++;}});
  });
  afterEach(function(){
  });

  describe('when initialized', function () {
    beforeEach(function(){
      intn.add('en', {one: 'One'});
    });
    it('should retrieve a single item', function () {
      expect(intn.get('one')).to.eql('One');
    });
    describe('with nested stuff', function () {
      beforeEach(function () {
        intn.add('en', {two: {three: '3', four: 'vier'}});
      });
      it('should find nested values', function () {
        expect(intn.get('two.three')).to.eql('3');
      });
      describe(', a relative manager', function () {
        var rel;
        beforeEach(function () {
          rel = intn.rel('two');
        });
        it('should find things relatively', function () {
          expect(rel.get('three')).to.eql('3');
          expect(rel.get('four')).to.eql('vier');
        });
        it("shouldn't find things it shouldn't", function () {
          expect(rel.get('one')).to.eql('');
          expect(logged).to.eql(1, 'logged once');
        });
      });
    });
  });

  describe('with some defaults', function () {
    beforeEach(function(){
      intn.addDefault('en', {a: 'A', b: 'B'});
    });
    describe('and an override', function () {
      beforeEach(function(){
        intn.add('en', {b: 'C'});
      });
      it('should find defaults', function () {
        expect(intn.get('a')).to.equal('A');
      });
      it('should respect override', function () {
        expect(intn.get('b')).to.equal('C');
      });
    });
    it('should find defaults', function () {
      expect(intn.get('a')).to.equal('A');
      expect(intn.get('b')).to.equal('B');
    });
  });

  describe('with multiple locales', function () {
    beforeEach(function () {
      intn.add('en', {a: 'A', b:'B'});
      intn.add('es', {a: 'Ae'});
    });
    it('should find the right one', function () {
      expect(intn.get('a')).to.eql('A');
    });
    describe('and ES selected', function () {
      beforeEach(function () {
        intn.setLocale('es');
      });
      it('should find the es one', function () {
        expect(intn.get('a')).to.eql('Ae');
      });
      it('should fallback & warn on bad key', function () {
        expect(intn.get('b')).to.eql('B');
        expect(logged).to.eql(1, 'logged was called');
      });
    });
  });

  describe('with failHard', function () {
    beforeEach(function () {
      intn.options.failHard = true;
    });
    it('should fail hard on bad key', function () {
      expect(intn.get.bind(intn, 'badKey')).to.throw(/not found/);
    });
  });
});
