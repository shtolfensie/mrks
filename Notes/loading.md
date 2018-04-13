## Handling loading of tests array

Right now controlling `loading` state in main `App.js` component. When component updates and the `tests` array changes, `loading` state is set to `false`.
This state is passed down to all components in `App.js`'s render that require it => all components that are either `<Tests />`, or contain `<Tests />`.
  - this includes `<Tests />` and `<Agenda />`

I don't know if this is the best way to do this. I don't like having to pass this prop down to all components that might require it. But i don't think that any more components will require it, so it may be ok. (Maybe the component that will be dealing with displaying tomorrows upcoming tests in `<Home/>`.)

**Still need to do this for the marks array.**