Feature: Change user password functionality

Scenario: User successfully changes their password
  Given A user logged in
  When They fill in the change password form and submit it
  Then A confirmation modal should be shown

Scenario: User enters a new password that doesn't match the confirmation
  When They fill in the change password form with mismatched passwords and submit it
  Then The error message "Passwords do not match" should be shown

Scenario: User enters a new password without an uppercase letter
  When They fill in the change password form with an invalid password and submit it
  Then The error message "Password must contain at least one uppercase letter" should be shown

Scenario: User enters a new password without a number
  When They fill in the change password form with an invalid password and submit it
  Then The error message "Password must contain at least one number" should be shown

Scenario: User enters a new password with spaces
  When They fill in the change password form with a password containing spaces and submit it
  Then The error message "Password cannot contain spaces" should be shown

Scenario: User enters a new password with less than 8 characters
  When They fill in the change password form with a password shorter than 8 characters and submit it
  Then The error message "Password must be at least 8 characters long" should be shown

Scenario: User enters incorrect current password
  When They fill in the current password form with an incorrect password and submit it
  Then The error message "Password update failed" should be shown