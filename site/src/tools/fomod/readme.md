# FOMOD Builder
The FOMOD Builder is a tool for creating FOMOD installers, a popular XML-based format for video game mod installers. It is the first of its kind to feature intuitive tooltips, dark mode, and eventually more. It is, at this time, incomplete.

## Roadmap:

- [ ] Full Schema Support
  - [X] Metadata Editing
  - [X] FOMOD
    - [X] Module Name
    - [ ] Required File Installs
    - [ ] Module Dependencies (Prerequisites)
    - [ ] Conditional File Installs
    - [X] Steps
      - [X] Step Name
      - [ ] Visibility Conditions
      - [X] Groups
        - [X] Group Name
        - [X] Group Selection Type
        - [X] Options
          - [X] Option Name
          - [X] Option Image
          - [X] Option Description
          - [X] Option States
            - [X] Option Default State
            - [ ] Option Conditioned States
          - [X] Option Flags
            - [ ] NICE: Autocomplete Names
            - [ ] NICE: Autocomplete Values
          - [ ] Option File Installs
  - [ ] Condition Editor
    - [ ] NICE: Condition Groups
    - [X] Condition Types
      - [X] Flag Dependency
        - [ ] NICE: Autocomplete Flags
        - [ ] NICE: Autocomplete Values
      - [X] File Dependency
        - [ ] NICE: Autocomplete Files
      - [X] Game Version Dependency
      - [X] Script Extender Version Dependency
      - [X] Mod Manager Version Dependency
        - [ ] NICE: Warn Against Using
      - [ ] NICE: Support using an Option as a dependency
- [X] Purpose-Built UI
- [ ] Auditing
  - [ ] Ensure Files Exist
  - [ ] Ensure Images Exist
  - [ ] Suggest using a Folder if more than 3 files are installed from a single directory
- [ ] Organized File Installs
  - The idea here is to completely redo how FOMOD file installs are handled from a creator's perspective. I'm not experienced enough with design to put what I'm thinking into words just yet.
  - [ ] Convert `installIfUsable` and `alwaysInstall` into regular conditions
  - [ ] Move all files into `requiredInstallFiles` and `conditionalFileInstalls`
  - [ ] Group installs with subconditions (install some files with the initial condition and more with a subcondition)
- [ ] Vortex-based UI
- [ ] MO2-based UI

There may well be more that I haven't thought of yet.
