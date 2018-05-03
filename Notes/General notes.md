## General notes about the mrks app

### Subjects

- maybe get subject marks from all marks, not via call to firebase, might be slow and expensive

### Agenda
- top header 'responsivnes' is total bullshit
- should be fixed right now
- it reacts to window resize, but it sucks.

### Marks

#### _DONE_ ~~Marks array request~~
- ~~Might want to get all marks in the main app, right now they are requested in the `<Marks />` component.~~
- ~~like this, the app doesn't need to load them if they are not needed right away. At this time, that includes the `Home`, `Subjects`* and the `Tests` components.~~
- ~~if in the future the array is needed elswhere, it might be good to move the function to the `<App />` component.~~

#### _SORT OF DONE_ AddMarkForm
- the third input is not in the form group anymore, it is on a different row
- (when selecting no test, after the third input appears, the first one shrinks a little bit. 
- need to ensure the size stays the same)

#### _DONE_: ~~Mark add form subject issue~~
- ~~If user selects a test, then `subjectId` and `subjectInitials` should be taken from that tests properties.~~
- ~~Only if user selects **No test**, should the dropdown select appear, and the `subjectId` and `subjectInitials` should be taken from it.~~

### Main Menu
- user accordeon is only temporary.
- the arrow should be on the right side
- the logout button doesnt look good

### Tests

- use regexp for searching
- finish subject filter
- teacher field in subject is probably not required
- why are subjects required for tests? maybe fix that

#### Filtering of `test` array
- Right now the only filter available is **Include graded** and the current setup doesn't allow for chaining of filters.
- The setup needs to be changed, so that different methods can add properties to a `filterBy` object, independent of each other.
  - This will include:
      1. ~~Show graded~~
      2. ~~A filter based on date (eg. Show only upcoming, from __this\_date__ to __this\_date__, show next 7 days, ...)
      3. ~~A search parameter (Ideally, the search will find anything that is included in the name, or in the subject of the test, or maybe even in the notes)~~
      4. A filter based on subject (eg. Only show Fy, ...)

#### _DONE_ ~~'More' menu of the test list item~~

~~Right now the only available button in the test list item is the delete button.
This needs to be replaced by a vertical 'three dot' menu~~
  - ~~this setup seems to work quite well (but the icons included in semantic react do not include three dot menu)~~
    - ~~\<Menu borderless compact text>~~
      - ~~\<Dropdown item icon='edit'>~~

_DONE_ ~~**Or maybe just use a 'pen'/'edit' icon and use it to open a modal.**~~