import { mapObj } from './util2';

export function scale(scale) {
  return (a, b) => {
    return sum(a, b) * scale;
  };
}

export function sum(a, b) {
  return a + b;
}

export function mul(a, b) {
  return a * b;
}

export function WeightedSum(weights, activation = sum) {
  function value() {
    return Object.values(weights)
      .map(_ => {
        const w = _[0],
              scale = _[1],
              v = (typeof w === 'object')?w.value():w;
        return v * scale;
      })
      .reduce(activation, 0);
  }
  
  function add(v) {
    Object.keys(v).forEach(k =>
      weights[k] = v[k]
    );
  }

  return {
    weights,
    value,
    add,
    json() {

      let children = {};

      Object.keys(weights)
        .forEach(key => {
          const w = weights[key][0];
          const res = (typeof w === 'object')?w.json():w;
          children[key] = res;
        });

      return {
        type: 'weight',
        w: value(),
        children
      };
    }
  };
}


export function Weights(weights) {
  const scale = 1/Object.keys(weights).length;

  return WeightedSum(
    mapObj(weights, (_, value) => [value, scale])
  );
}

export function Compose(a, b, f) {
  return WeightedSum({ a: [a, 0.5], b: [b, 0.5] }, f);
}

export function Weight(v) {
  return {
    value() {
      return v;
    },
    json() {
      return v;
    }
  };
}