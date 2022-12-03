# assert-to-expect
change from assert to jest's expect

## Installation

```
npm install assert-to-expect
```

## Usage

```
npx assert-to-expect [path] -m [matchRegex]
```

Example:

```
npx assert-to-expect ./src -m .*\\.tsx$
```

You can change the code using assert to use expect as bellow.

The code before change,

```
import assert from 'assert';

assert(wrapper.instance() instanceof Int);
assert.strictEqual(wrapper.find('Dropdown').length, 1);
assert.deepStrictEqual(wrapper.prop('texts'), ['react', 'vue']);
```

The code after change,
```
expect(wrapper.instance() instanceof Int).toBe(true);
expect(wrapper.find('Dropdown').length).toBe(1);
expect(wrapper.prop('texts')).toEqual( ['react', 'vue']);
```


### path

The value of path to change.

### matchRegex

Regular expression for matching files.

