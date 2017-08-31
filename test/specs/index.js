import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import Clampdown from '../../src';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when the Clampdown class is initialised', () => {
  describe('when a valid element is not pased in as an argument', () => {
    it('should create an instance of the Geta rest client with the default options', () => {
      const clampdown = new Clampdown();
      expect(clampdown).to.be.instanceOf(Clampdown);
      expect(clampdown.errors).to.be.lengthOf(1);
    });
  });
});
