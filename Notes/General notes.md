## General notes about the mrks app

- try putting test, subject edit form into one component

- mark edit form

- previous tests grouped by month, not finished. should display X months ago. should also dispaly year

### Subjects

- maybe get subject marks from all marks, not via call to firebase, might be slow and expensive

### Agenda
- top header 'responsivnes' is total bullshit
- should be fixed right now
- it reacts to window resize, but it sucks.


#### _SORT OF DONE_ AddMarkForm
- the third input is not in the form group anymore, it is on a different row
- (when selecting no test, after the third input appears, the first one shrinks a little bit. 
- need to ensure the size stays the same)

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
- ~~Right now the only filter available is **Include graded** and the current setup doesn't allow for chaining of filters.~~
- ~~The setup needs to be changed, so that different methods can add properties to a `filterBy` object, independent of each other.~~
  - This will include:
      1. ~~Show graded~~
      2. ~~A filter based on date (eg. Show only upcoming, from __this\_date__ to __this\_date__, show next 7 days, ...)
      3. ~~A search parameter (Ideally, the search will find anything that is included in the name, or in the subject of the test, or maybe even in the notes)~~
      4. A filter based on subject (eg. Only show Fy, ...)