export function memoize(fn) {
  let cache = {};

  return function(arg) {
    const key = arg;

    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(arg);
    }
    return cache[key];
  };
}

export function memoize2(fn) {
  let cache = {};

  return function(a, b, c, d) {
    const key = `${a}-${b}-${c}-${d}`;

    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(a, b, c, d);
    }
    return cache[key];
  };
}

function objectCompare(obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!objectCompare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};

export function groupObj(obj, group) {
  const res = {};
  for (let key of Object.keys(obj)) {
    const k = group(key, obj[key]);

    if (!res[k]) res[k] = [];

    res[k].push(key);
  }
  return res;
}

export function filterObj(obj, filter) {
  const res = {};
  for (let key of Object.keys(obj)) {
    if (filter(key, obj[key])) {
      res[key] = obj[key];
    }
  }
  return res;
}

export function mapObj(obj, map) {
  const res = {};
  for (let key of Object.keys(obj)) {
    res[key] = map(key, obj[key]);
  }
  return res;
}

export function objLength(obj) {
  return Object.keys(obj).length;
}
