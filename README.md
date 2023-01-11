This recreates an issue I am having with new tinacms dynamic filename/route stuff.

It seems like a cool API, but doesn't allow me to have routes that users can edit.


There are 2 projects:

- [latest](latest/) - created with `npx create-tina-app@latest latest`
- [old](old/) - older method that would allow me to do what I want to

Basic operation should be like this:

### post

- has a field `slug` that is user-entered, and derived from `title` on initial load
- has a field `date` that is default current-date
- `filename` is derived initially (when a user makes new content) from `${date}-${slug}`
- user can change `slug` and it changes the url (but leaves the `filename`)

This works in [old](old/) but not [latest](latest/)