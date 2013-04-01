# component-sass

Component plugin to compile SCSS files on-the-fly. This allows you to write components in SCSS. In addition, it adds
all of your `paths` from your `component.json` as Sass load paths.

## Installation

```
npm install component-sass
```

## Usage

```
component build --use component-sass
```

Add you SCSS files to the `styles` section of your `component.json`

```
{
  "name": "foo",
  "path": ["local"],
  "styles": ["index.scss"]
}
```

Now in your `index.scss`:

```
.foo {
  .bar {
    color: red;
  }
}
```

If you have other Sass components stored in any of your `paths` (eg ./local/my-component/index.scss) you can require them easily:

```
@import "my-component/index";
```