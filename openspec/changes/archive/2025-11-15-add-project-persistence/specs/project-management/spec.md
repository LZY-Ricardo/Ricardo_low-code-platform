## ADDED Requirements

### Requirement: Project Persistence
The system SHALL provide the ability to save and restore user-created projects persistently.

#### Scenario: User saves project manually
- **WHEN** user clicks the "Save" button in the header
- **THEN** the current project (including all components, props, styles, and events) SHALL be saved to LocalStorage
- **AND** a success notification SHALL be displayed

#### Scenario: User creates a new project
- **WHEN** user clicks "New Project" button
- **THEN** a new empty project SHALL be created with a default name (e.g., "未命名项目_1")
- **AND** the project SHALL be saved to LocalStorage
- **AND** the editor SHALL switch to the new empty project

#### Scenario: User switches between projects
- **WHEN** user selects a different project from the project dropdown
- **THEN** the current project SHALL be saved automatically
- **AND** the selected project's data SHALL be loaded into the editor
- **AND** all components SHALL be rendered according to the loaded data

#### Scenario: Auto-save on changes
- **WHEN** user modifies any component (add, delete, update props/styles/events)
- **THEN** the system SHALL automatically save the project after 3 seconds of inactivity (debounced)
- **AND** no notification SHALL be shown for auto-save

#### Scenario: Application restart recovery
- **WHEN** user reopens the application in the same browser
- **THEN** the system SHALL load the last opened project automatically
- **AND** all components SHALL be restored to their previous state

### Requirement: Project Management
The system SHALL provide project management capabilities including listing, renaming, and deleting projects.

#### Scenario: User views all projects
- **WHEN** user clicks the project dropdown in the header
- **THEN** a list of all saved projects SHALL be displayed
- **AND** each project SHALL show its name and last modified time

#### Scenario: User renames a project
- **WHEN** user clicks the rename option for a project
- **THEN** an input modal SHALL appear with the current project name
- **AND** after user confirms the new name, the project SHALL be renamed in LocalStorage
- **AND** the project list SHALL be updated

#### Scenario: User deletes a project
- **WHEN** user clicks the delete option for a project
- **THEN** a confirmation modal SHALL appear
- **AND** after user confirms, the project SHALL be removed from LocalStorage
- **AND** if the deleted project was currently open, the system SHALL switch to another project or create a new empty project

### Requirement: Data Structure
The system SHALL store projects using a standardized JSON structure in LocalStorage.

#### Scenario: Project data structure validation
- **WHEN** a project is saved
- **THEN** the project data SHALL include:
  - `id`: unique project identifier (string)
  - `name`: project name (string)
  - `components`: component tree (Component[])
  - `createdAt`: creation timestamp (number)
  - `updatedAt`: last modification timestamp (number)

#### Scenario: LocalStorage capacity handling
- **WHEN** LocalStorage is approaching its capacity limit (5-10MB)
- **THEN** the system SHALL detect the QuotaExceededError
- **AND** display a warning message to the user
- **AND** suggest deleting old projects or exporting data

### Requirement: Error Handling
The system SHALL handle storage errors gracefully without data loss.

#### Scenario: Corrupted data recovery
- **WHEN** the system detects corrupted project data in LocalStorage
- **THEN** the system SHALL log the error
- **AND** skip the corrupted project
- **AND** load other valid projects normally

#### Scenario: Storage access failure
- **WHEN** LocalStorage is not available (private browsing mode, disabled)
- **THEN** the system SHALL display a warning message
- **AND** continue to function in memory-only mode (data lost on refresh)
