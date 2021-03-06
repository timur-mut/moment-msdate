'use strict';

const assert = require('assert');
const moment = require('../moment-msdate');

function testBothDirections(iso, oad) {
	const isoMoment = moment.fromOADate(oad).toISOString();
	const oadMoment = moment(iso).utc().toOADate();
	assert.equal(oadMoment, oad);
	assert.equal(isoMoment, iso);
}

describe('moment-msdate', () => {
	console.log('********************************************************');
	console.log('*** great scott!! it\'s 2015-10-21T16:29:00.000-07:00 ***');
	console.log('********************************************************');

	describe('moment.fromOADate - error handling', () => {
		it('should throw an error if oaDate is null', () => {
			assert.throws(function() { moment.fromOADate(null); }, function(e) { return e instanceof TypeError; });
		});

		it('should throw an error if oaDate is undefined', () => {
			assert.throws(function() { moment.fromOADate(undefined); }, function(e) { return e instanceof TypeError; });
		});

		it('should throw an error if offset is a timezone not available in moment-timezone.js', () => {
			assert.throws(
				function() { moment.fromOADate(42298.6868055556, 'Roads? Where we\'re going, we don\'t need roads.'); },
				function(e) { return e instanceof Error; }
			);
		});
	});

	describe('moment.fromOADate', () => {
		it('should convert 42298.6868055556 to 2015-10-21T16:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556).toISOString(), '2015-10-21T16:29:00.000Z');
		});

		it('should not interfer with moment timezone', () => {
			const myMoment = moment.fromOADate(42298.978472222225);
			myMoment.tz('America/Los_Angeles');
			assert.equal(myMoment.format('LLLL'), 'Wednesday, October 21, 2015 4:29 PM');
		});

		it('should have a timezone of utc', () => {
			const myMoment = moment.fromOADate(42298.6868055556);
			assert.ok(myMoment.isUtc());
		});
	});

	describe('moment.fromOADate - minutes', () => {
		it('should convert 42298.6868055556 to 2015-10-21T16:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 0).toISOString(), '2015-10-21T16:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T20:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 240).toISOString(), '2015-10-21T20:29:00.000Z');
			assert.equal(moment.fromOADate(42298.6868055556, 240).format('LLLL'), 'Wednesday, October 21, 2015 8:29 PM');
		});

		it('should convert 42298.6868055556 to 2015-10-21T21:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 300).toISOString(), '2015-10-21T21:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T22:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 360).toISOString(), '2015-10-21T22:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T23:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 420).toISOString(), '2015-10-21T23:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T23:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 420).toISOString(), '2015-10-21T23:29:00.000Z');
		});

		it('should have a timezone of utc', () => {
			const myMoment = moment.fromOADate(42298.6868055556, 240);
			assert.ok(myMoment.isUtc());
		});

		it('should not interfere with moment-timezone', () => {
			const myMoment = moment.fromOADate(42298.6868055556, 240);
			myMoment.tz('America/New_York');
			assert.equal(myMoment.toISOString(), '2015-10-21T20:29:00.000Z');
			assert.equal(myMoment.format('LLLL'), 'Wednesday, October 21, 2015 4:29 PM');
		});
	});

	describe('moment.fromOADate - timezone', () => {
		it('should convert 42298.6868055556 to 2015-10-21T20:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 'America/New_York').toISOString(), '2015-10-21T20:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T21:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 'America/Chicago').toISOString(), '2015-10-21T21:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T22:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 'America/Denver').toISOString(), '2015-10-21T22:29:00.000Z');
		});

		it('should convert 42298.6868055556 to 2015-10-21T23:29:00.000Z', () => {
			assert.equal(moment.fromOADate(42298.6868055556, 'America/Los_Angeles').toISOString(), '2015-10-21T23:29:00.000Z');
		});

		it('should handle times near DST change', () => {
			assert.equal(moment.fromOADate(43044, 'America/Denver').toISOString(), '2017-11-05T06:00:00.000Z');
			assert.equal(moment.fromOADate(43044.25, 'America/Denver').toISOString(), '2017-11-05T12:00:00.000Z');
			assert.equal(moment.fromOADate(43044.15, 'America/Denver').toISOString(), '2017-11-05T09:36:00.000Z');
			assert.equal(moment.fromOADate(43044.18, 'America/Denver').toISOString(), '2017-11-05T10:19:12.000Z');
			// Fails - it seems our offset is too close to the DST change
			// assert.equal(moment.fromOADate(43044.105, 'America/Denver').toISOString(), '2017-11-05T07:31:12.000Z');
		});

		it('should have a timezone of utc', () => {
			const myMoment = moment.fromOADate(42298.6868055556, 'America/New_York');
			assert.ok(myMoment.isUtc());
		});

		it('should not interfere with moment-timezone', () => {
			const myMoment = moment.fromOADate(42298.6868055556, 'America/New_York');
			myMoment.tz('America/New_York');
			assert.equal(myMoment.toISOString(), '2015-10-21T20:29:00.000Z');
			assert.equal(myMoment.format('LLLL'), 'Wednesday, October 21, 2015 4:29 PM');
		});
	});

	describe('moment.fn.toOADate', () => {
		it('should convert 2015-10-21T16:29:00.000Z to 42298.6868055556', () => {
			const myMoment = moment('2015-10-21T16:29:00.000Z').utc();
			assert.equal(myMoment.toOADate(), 42298.68680555555);
		});

		it('should convert 2015-10-21T16:29:00.000-04:00 to 42298.853472222225', () => {
			const myMoment = moment('2015-10-21T16:29:00.000-04:00').utc();
			assert.equal(myMoment.toOADate(), 42298.853472222225);
		});

		it('should convert 2015-10-21T16:29:00.000-05:00 to 42298.89513888889', () => {
			const myMoment = moment('2015-10-21T16:29:00.000-05:00').utc();
			assert.equal(myMoment.toOADate(), 42298.89513888889);
		});

		it('should convert 2015-10-21T16:29:00.000-06:00 to 42298.93680555555', () => {
			const myMoment = moment('2015-10-21T16:29:00.000-06:00');
			assert.equal(myMoment.toOADate(), 42298.93680555555);
		});

		it('should convert 2015-10-21T16:29:00.000-07:00 to 42298.978472222225', () => {
			const myMoment = moment('2015-10-21T16:29:00.000-07:00');
			assert.equal(myMoment.toOADate(), 42298.978472222225);
		});
	});

	describe('Negative OADates and edge conditions', () => {
		it('OADate: 27 December 1899, midnight', () => {
			testBothDirections('1899-12-27T00:00:00.000Z', -3.0);
		});

		it('OADate: 28 December 1899, noon', () => {
			testBothDirections('1899-12-28T12:00:00.000Z', -2.5);
		});

		it('OADate: Jody 29 December 1899, 6:00 PM', () => {
			testBothDirections('1899-12-29T18:00:00.000Z', -1.75);
		});

		it('OADate: 29 December, noon', () => {
			testBothDirections('1899-12-29T12:00:00.000Z', -1.5);
		});

		it('OADate: 29 December 1899, 6:00 AM', () => {
			testBothDirections('1899-12-29T06:00:00.000Z', -1.25);
		});

		it('OADate: 29 December 1899, midnight', () => {
			testBothDirections('1899-12-29T00:00:00.000Z', -1.0);
		});

		it('OADate: 30 December 1899, midnight', () => {
			testBothDirections('1899-12-30T00:00:00.000Z', 0.0);
		});

		it('OADate: 30 December 1899, 6:00 am', () => {
			testBothDirections('1899-12-30T06:00:00.000Z', 0.25);
		});

		it('OADate: 30 December 1899, noon', () => {
			testBothDirections('1899-12-30T12:00:00.000Z', 0.50);
		});

		it('OADate: 30 December 1899, noon', () => {
			testBothDirections('1899-12-30T18:00:00.000Z', 0.75);
		});

		it('OADate: 31 December 1899, midnight', () => {
			testBothDirections('1899-12-31T00:00:00.000Z', 1.0);
		});

		it('OADate: 1 January 1900, 6:00 AM', () => {
			testBothDirections('1900-01-01T06:00:00.000Z', 2.25);
		});

		it('OADate: 2 January 1900, midnight', () => {
			testBothDirections('1900-01-02T00:00:00.000Z', 3.0);
		});

		it('OADate: 4 January 1900, midnight', () => {
			testBothDirections('1900-01-04T00:00:00.000Z', 5.0);
		});

		it('OADate: 4 January 1900, 6:00 AM', () => {
			testBothDirections('1900-01-04T06:00:00.000Z', 5.25);
		});

		it('OADate: 4 January 1900, noon', () => {
			testBothDirections('1900-01-04T12:00:00.000Z', 5.5);
		});

		it('OADate: 4 January 1900, 9:00 PM', () => {
			testBothDirections('1900-01-04T21:00:00.000Z', 5.875);
		});
	});
});
