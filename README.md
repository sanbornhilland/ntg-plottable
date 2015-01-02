#ntg-plottable
=============

##Angular Wrapper for plottable.js

Wraps the plottables.js library for use in Angular applications. 

###Currently Available Directives:

1. `plottable-scatter`


## API Reference

###Scatter Plot

Ex: `<plottable-scatter data="someData" regression="regressionType" axis-x"xData" axis-y"yData"></plottable-scatter>`

####Data

`data="someData"`
Required

The value of someData should be the data you want to chart, represented as an array of point objects such as:

```
someData = [
  {'xVal': 1, 'yVal': 2},
  {'xVal': 10, 'yVal': 22},
  {'xVal': 9, 'yVal': 6},
  {'xVal': 14, 'yVal': 17}
  ...
]
```

Note, the property names do no matter as long as they are consistent. You will specify which property to use on which axis using the `axis-x` and `axis-y` attributes.

####X and Y Data

`axis-x="xVal"` and `axis-y="yVal"`
Required

Specify which property of each point object will be used as the X values and which property will be used as the Y Values.

####Regressions

`regression="linear"`
Optional

You may optionally add a regression line to the chart by specifying which type of regression you want displayed. Currently only supporting linear regression.




