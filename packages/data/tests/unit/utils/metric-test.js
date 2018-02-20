import { canonicalizeMetric, hasParameters, serializeParameters,
  getAliasedMetrics, canonicalizeAlias } from 'navi-data/utils/metric';
import { module, test } from 'qunit';

module('Unit - Utils - Metrics Utils', {
  unit: true
});

test('canonicalize metric', function(assert){
  assert.expect(5);
  assert.equal(canonicalizeMetric({metric: 'foo'}),
    'foo',
    'correctly serializes metric with no params');

  assert.equal(canonicalizeMetric({metric: 'foo', parameters: {}}),
    'foo',
    'correctly serializes metric with empty object params');

  assert.equal(canonicalizeMetric({metric: 'foo', parameters: null}),
    'foo',
    'correctly serializes metric with null object params');

  assert.equal(canonicalizeMetric({metric: 'foo', parameters: {p1: '100'}}),
    'foo(p1=100)',
    'correctly serializes metric with one param');

  assert.equal(canonicalizeMetric({metric: 'foo', parameters: {p1: '100', a: '12'}}),
    'foo(a=12,p1=100)',
    'correctly serializes metric with multiple params');

});

test('has parameters check', function(assert){
  assert.expect(5);
  assert.equal(hasParameters({metric: 'foo'}),
    false,
    'metric with no params');

  assert.equal(hasParameters({metric: 'foo', parameters: {}}),
    false,
    'metric with empty object params');

  assert.equal(hasParameters({metric: 'foo', parameters: null}),
    false,
    'metric with null object params');

  assert.equal(hasParameters({metric: 'foo', parameters: {p1: '100'}}),
    true,
    'metric with one param');

  assert.equal(hasParameters({metric: 'foo', parameters: {p1: '100', a: '12'}}),
    true,
    'multiple params');
});

test('serialize parameters check', function(assert){
  assert.expect(3);
  assert.equal(serializeParameters({}),
    '',
    'metric with no params');

  assert.equal(serializeParameters({b: 1, c: 2, a: 3}),
    'a=3,b=1,c=2',
    'metric with multiple parameters');

  assert.equal(serializeParameters({currency: 'USD'}),
    'currency=USD',
    'metric with single parameters');
});

test('alias map generator check', function(assert){
  assert.expect(3);
  let metrics = [
    {metric: 'foo'},
    {metric: 'bar', parameters: {pos: 1, as: 'm1'}},
    {metric: 'ham', parameters: {pos: 3, as: 'm2'}}
  ];
  assert.deepEqual(getAliasedMetrics(metrics),
    {
      m1: 'bar(pos=1)',
      m2: 'ham(pos=3)'
    },
    'generates map correctly');

  assert.deepEqual(getAliasedMetrics([]),
    {},
    'empty metrics get empty alias map');

  assert.deepEqual(getAliasedMetrics([
    {metric: 'foo'},
    {metric: 'bar', parameters: {pos: 12}}
  ]),
  {},
  'metrics with no aliases return empty object');
});

test('get canonicalized metric from alias', function(assert) {
  assert.expect(4);
  let aliasMap = {
    m1: 'bar(pos=1)',
    m2: 'ham(pos=3)'
  };

  assert.equal(canonicalizeAlias('m1', aliasMap), 'bar(pos=1)', 'gets canonicalized metric from alias');
  assert.equal(canonicalizeAlias('m3', aliasMap), 'm3', 'returns what\'s passed if not in alias map');
  assert.equal(canonicalizeAlias('m1'), 'm1', 'returns alias without alias map');
  assert.equal(canonicalizeAlias('m1', {}), 'm1', 'returns alias with empty alias map');
});
