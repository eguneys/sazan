
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

function rightScale(values) {
  const scale = 1/values.length;
  return (a, b) => a + b * scale;
}

export function WeightedSum(weights) {
  function value() {
    return Object.values(weights)
      .map(_ => _[0].value() * _[1])
      .reduce(sum, 0);
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
      const res = {};
      Object.keys(weights)
        .forEach(key =>
          res[key] = { p: weights[key][0].json() }
        );
      res['w'] = value();
      return res;
    }
  };
}


export function Weights(weights, activation = rightScale) {
  function value() {
    const res = Object.values(weights)
      .map(_ => {
        return _.value();
      })
      .reduce(activation(Object.values(weights)), 0);
    return res;
  }

  return {
    size() {
      return Object.values(weights).length;
    },
    weights,
    value,
    json() {
      const res = {};
      Object.keys(weights).forEach(w => 
        res[w] = weights[w].json()
      );
      res['w'] = value();
      return res;
    }
  };
}

export function Compose(a, b, f) {
  function value() {
    return f(a.value(), b.value());
  }
  return {
    a,
    b,
    value,
    json() {
      return {
        w: value(),
        a: a.json(), b: b.json()
      };
    }
  };
}

export function Weight(weight) {
  return {
    weight,
    value() {
      if (weight != 0 && !weight) {
        debugger;
      }
      return weight;
    },
    json() {
      return weight;
    }
  };
}
