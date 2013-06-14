
# Loco

  Internationalization component

## Installation

    $ component install notablemind/loco

## API

### LocaleManager(name, options)

- options.log [console.error by default] where to complain if a key is missing
- options.failHard [default false]: throw an error on a missing key

#### addDefault(items, options)

- options.rel: list of relative path

These are added to the default locale

#### add(locale, items, options)

#### get(key, rel)

- rel: list of relative path

Get's the string from the currentLocale

#### getLoc(locale, key)
   
#### setLocale(name)

Set the current locale

#### setBaseLocale(name)

Set the locale to which things fallback.

## License

  MIT
