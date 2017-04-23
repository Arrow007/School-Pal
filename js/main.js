(function() {
    'use strict';


    /*
      All functions are defined here
    */

    // Create a function to check single line text fields for completion
    function utilCheckFields(className) {
        // Declare a variable to be return with the default value of false
        var valid = true;
        // Iterate through elements with class name given
        for (var i = 0; i < document.getElementsByClassName(className).length; i++) {
            // Remove whitespace and check if the field has data
            if ($.trim(document.getElementsByClassName(className)[i].value).length !== 0) {
                // The field does have data move to the next one
                continue;
            } else {
                // The field doesn't have data change the valid variable to false
                valid = false;
                // Stop the for loop
                break;
            }
        }
        // Return if the fields are valid or not
        return valid;
    }

    // Create a functions to handle displaying error to the user
    function showError(message) {
        // Create a message on the user's screen with red text starting with ERROR followed by the message passed
        Materialize.toast('ERROR ' + message, 5000, 'red-text');
        // Log the error given to the   
        console.error('Message: ' + message);
    }

    // Create a function to handle errors thrown by firebase
    function FBErrorHandler(error) {
        // Create a switch statement to handle the errors based on their code
        switch (error.code) {
            // Default error handler if their is no specific instructions specified
            case 'auth/app-deleted':
                // Display an message to the user specific to the error
                showError('There had been an error with the code possibly cause by you');
                // End the handler
                break;
            case 'auth/app-not-authorized':
                // Display an message to the user specific to the error
                showError('Either we made a mistake or this is not a genuine site');
                // End the handler
                break;
            case 'auth/argument-error':
                // Display an message to the user specific to the error
                showError('Oops there was an error in our code');
                // End the handler
                break;
            case 'auth/invalid-api-key':
                // Display an message to the user specific to the error
                showError('Either we made a mistake, you messed with the code or this is not a genuine site');
                // End the handler
                break;
            case 'auth/invalid-user-token':
                // Display an message to the user specific to the error
                showError('We will now log you out and redirect you to the login page');
                // Sign the user out of the app
                firebase.auth().signOut()
                    .then(function() {
                        // The user was signed out successfully
                        // Redirect the user to the login page
                        window.location.pathname = '/login/index.html';
                        $('.no-auth').hide();
                    });
                // End the handler
                break;
            case 'auth/network-request-failed':
                // Display an message to the user specific to the error
                showError('Network issue');
                // End the handler
                break;
            case 'auth/operation-not-allowed':
                // Display an message to the user specific to the error
                showError('Either we made a mistake, you messed with the code or this is not a genuine site');
                // End the handler
                break;
            case 'auth/requires-recent-login':
                // Display an message to the user specific to the error
                showError('We will now log you out and redirect you to the login page');
                // Sign the user out of the app
                firebase.auth().signOut()
                    .then(function() {
                        // The user was signed out successfully
                        // Redirect the user to the login page
                        window.location.pathname = '/login/index.html';
                    });
                // End the handler
                break;
            case 'auth/too-many-requests':
                showError('The server has detected that you are sending too many requests to the server');
                // End the handler
                break;
            case 'auth/unauthorized-domain':
                // Display an message to the user specific to the error
                showError('Either we made a mistake, you messed with the code or this is not a genuine site');
                // End the handler
                break;
            case 'auth/user-disabled':
                // Display an message to the user specific to the error
                showError('Your account has been disabled this is probably due to inappropriate usage');
                // End the handler
                break;
            case 'auth/user-token-expired':
                // Display an message to the user specific to the error
                showError('We will now log you out and redirect you to the login page');
                // Sign the user out of the app
                firebase.auth().signOut()
                    .then(function() {
                        // The user was signed out successfully
                        // Redirect the user to the login page
                        window.location.pathname = '/login/index.html';
                    });
                // End the handler
                break;
            case 'auth/web-storage-unsupported':
                // Display an message to the user specific to the error
                showError('Please upgrade your browser');
                // End the handler
                break;
            case 'auth/email-already-in-use':
                // Display an message to the user specific to the error
                showError('The email entered is already being used');
                // End the handler
                break;
            case 'auth/invalid-email':
                // Display an message to the user specific to the error
                showError('The email address provided is invalid');
                // End the handler
                break;
            case 'auth/weak-password':
                // Display an message to the user specific to the error
                showError('Please use a stronger password');
                // End the handler
                break;
            default:
                // Log the errors details to the console
                console.error('Code: ' + error.code + ' Message: ' + error.message);
        }
    }

    // Wait for Document to be loaded and then fire callback function
    $(document).ready(function() {


        /*
            Define variables to be used here
        */

        var FirebaseConfig = {
            apiKey: 'AIzaSyAwTdbmVW2ib8-hx2Q4GIMmJ_vYF7bP7fo',
            authDomain: 'school-pal.firebaseapp.com',
            databaseURL: 'https://school-pal.firebaseio.com',
            storageBucket: 'school-pal.appspot.com',
            messagingSenderId: '351892489329',
        };
        // Create a variable to store a new GoogleAuthProvider instance
        // Later used to create a popup to authenticate with Google
        var GoogleProvider = new firebase.auth.GoogleAuthProvider();


        /*
            Initialize elements to their appropriate handlers
        */

        // Setup tooltips to be displayed with a default delay of 50ms
        $('.tooltip').tooltip({
            delay: 50,
        });
        // Initialize the side navs on the pages for use
        $('.button-collapse').sideNav({
            draggable: true
        });
        // Initialize the tabs on the pages for use
        $('ul.tabs').tabs();
        // Initialize the selection dropdowns on the pages for use
        $('select').material_select();
        // Initialize the models and prevent close on click off
        $('.modal').modal({
            dismissible: false,
        });
        // Initialize the datepicker with a specific format and enabling month support
        $('.datepicker').pickadate({
            selectMonths: true,
            format: 'dd mmmm yyyy'
        });


        /*
            JQuery handlers for login page
        */

        // Listen for a click on the Login button element
        $('#button__login-password').click(function() {
            // Call the utilCheckFields function to check if all the fields with the class login_field are filled out
            if (utilCheckFields('login__field')) {
                // The login fields are completed with data
                // Attempt to authenticate the user with an email and password
                firebase.auth().signInWithEmailAndPassword($('#text__login-email').val(), $('#text__login-password').val())
                    // Catch any errors thrown and feed them to the error handler
                    .catch(FBErrorHandler);
            } else {
                // The login fields aren't completed with data
                Materialize.toast('Please provide your account details to be logged in!', 5000);
            }
        });
        // Listen for click on the Google login button
        $('#button__login-google').click(function() {
            // Utilize firebases built in Google popup authentication
            firebase.auth().signInWithRedirect(GoogleProvider);
        });
        // Listen for click on the Signup button
        $('#button__signup').click(function() {
            // Call the utilCheckFields function to check if all the fields with the class signup_field are filled out
            if (utilCheckFields('signup__field')) {
                // The signup fields are completed with data
                // Check if both the passwords provided match to help prevent immediate unknown password
                if ($('#text__signup-password').val() == $('#text__signup-password-confirm').val()) {
                    // Both of the passwords matched each other
                    // Create a new user account with the email and password provided
                    firebase.auth().createUserWithEmailAndPassword($('#text__signup-email').val(), $('#text__signup-password').val())
                        // Catch any errors thrown and feed them to the error handler
                        .catch(FBErrorHandler)
                        // Create a function to be called when the user account is created successfully
                        .then(function() {
                            // The user account was created successfully
                            firebase.auth().currentUser.updateProfile({
                                    // Update the users name
                                    displayName: $('#text__signup-first-name').val() + ' ' + $('#text__signup-last-name').val(),
                                })
                                // Catch any errors thrown and feed them to the error handler
                                .catch(FBErrorHandler);
                            // Send a verification email to the user
                            firebase.auth().currentUser.sendEmailVerification()
                                // Catch any errors thrown and feed them to the error handler
                                .catch(FBErrorHandler);
                        });
                } else {
                    // The passwords didn't match each other
                    // Create a message on the user's screen stating that the passwords didn't match
                    Materialize.toast('The passwords entered do not match!', 5000);
                }
            } else {
                // The signup fields aren't completed with data
                // Create a message to tell the user that not all of the fields are complete
                Materialize.toast('Please fill out all of the visible fields!', 5000);
            }
        });


        /*
            JQuery handlers for all pages
        */

        // Wait for the user to click the submit button for their account setup data
        $('#button_submit-account-setup').click(function() {
            // Check if the text field contains text
            if ($.trim($('#textarea__reason-for-use').val()).length !== 0) {
                // The text field does contain text
                // Log the reason for use on the database
                firebase.database().ref('/analytics/').push({
                    reason: $('#textarea__reason-for-use').val(), // Get the reason provided
                    date: new Date(), // Get the current date and time
                    user: firebase.auth().currentUser.uid, // Get the user's uid
                });
            }
            // Create a new user in the database to hold the user's data
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
                type: $('#select__account-type').val(), // Get the account type either teacher or student
                created: new Date(), // Get the current date and time
            }).then(function() {
                // The data was successfully written to the database
                // Hide the account setup overlay
                $('.section__account-setup').fadeOut();
            });
        });
        // Wait for the user to click on the logout button
        $('#button__logout').click(function() {
            // The user clicked the logout button
            // Logout the user from the firebase app
            firebase.auth().signOut();
        });
        $('#button__logout_sidenav').click(function() {
            // The user clicked the logout button
            // Logout the user from the firebase app
            firebase.auth().signOut();
        });


        /*
            JQuery handlers for notes page
        */

        // Wait for the user to click the ok button on the bottom of the create / edit note moal
        $('#button__finish-create-edit-note').click(function() {
            // Check if there is a note id passed to the model indicating the user is editing a note
            if ($('#modal_create-edit-note').attr('data-id')) {
                // There is a note id passed to the modal
                // Get the user's notes directory in the database
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                    // Get the note with the id passed to the modal
                    .child($('#modal_create-edit-note').attr('data-id'))
                    .set({
                        name: $('#text__create-edit-note-name').val(), // Get the name(title) of the note
                        message: $('#textarea__create-edit-note-text').val(), // Get the message(text) of the note
                    });
                $('#modal_create-edit-note').modal('close');
                // Remove the text from the create / edit note modal
                $('.create-edit-note-required').val('');
                // Tell the text field labels that there is no longer text in the text fields
                $('#modal_create-edit-note label').removeClass('active');
                // Remove the id passed to the create / edit note dialog
                $('#modal_create-edit-note').removeAttr('data-id');
            } else {
                // There is not a note id passed to the modal
                // Check to ensure that all of the required fields are updated
                if (utilCheckFields('create-edit-note-required')) {
                    // There is data provided in the required fields
                    // Get a reference to the users notes directory
                    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                        // Add a new note the directory
                        .push({
                            name: $('#text__create-edit-note-name').val(), // Get and set the name of the new note
                            message: $('#textarea__create-edit-note-text').val(), // Get and set the text of the new note
                            created: new Date(), // Get and set the date and time created
                        });
                    // Close the create / edit note dialog
                    $('#modal_create-edit-note').modal('close');
                    // Remove all of the text in the create / edit note dialog
                    $('.create-edit-note-required').val('');
                    // Tell the textarea to update its size
                    $('#textarea__create-edit-note-text').trigger('autoresize');
                } else {
                    // The required data was not supplied by the user
                    // Tell the user that the data was not supplied and ask them to supply it
                    Materialize.toast('Please write a title and a message for the note!', 5000);
                }
            }
            // Tell the text fields that their is no longer data to be valid
            $('.create-edit-note-required').removeClass('valid');
        });
        // Wait for the user to click the close button in the create / edit note modal
        $('#button__close-create-create-edit-note').click(function() {
            // Close / hide the modal from the user
            $('#modal_create-edit-note').modal('close');
            // Remove the text entered in the create / edit note text fields
            $('.create-edit-note-required').val('');
            // Tell the textfields that they no longer have text
            $('#modal_create-edit-note label').removeClass('active');
            // Tell the textfields that there is no data to be valid
            $('.create-edit-note-required').removeClass('valid');
            // Remove the note id passed to the text field
            $('#modal_create-edit-note').removeAttr('data-id');
            // Tell the textarea to update its size
            $('#textarea__create-edit-note-text').trigger('autoresize');
        });
        // Listen for the edit button in the view note modal to be pressed
        $('#button_edit-note-viewing').click(function() {
            // Set a variable to contain the id of the note
            var id = $('#modal_view-note').attr('data-id');
            // Set a variable to contain the name of the note
            var name = $('#modal_view-note h4').text();
            // Create a variable to contain the message of the note
            var message = $('#modal_view-note p').text();
            // Close the view note modal
            $('#modal_view-note').modal('close');
            // Pass the note id to the dialog
            $('#modal_create-edit-note').attr('data-id', id);
            // Set the name of the note being edited
            $('#text__create-edit-note-name').val(name);
            // Set the message of the note being edited
            $('#textarea__create-edit-note-text').val(message);
            // Tell the edit note text fields that there are text in them
            $('#modal_create-edit-note label').addClass('active');
            // Tell the message textarea to update its sized based on the text contained
            $('#textarea__create-edit-note-text').trigger('autoresize');
            // Open the edit note modal
            $('#modal_create-edit-note').modal('open');
        });
        // Listen for the user to click the delete note that is currently being view in the view note modal
        $('#button_delete-note-viewing').click(function() {
            // Set a variable with the id passed to the modal
            var id = $('#modal_view-note').attr('data-id');
            // Get the user's notes directory in the database
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                // Get the note with the id passed
                .child(id)
                // Remove the note from the database
                .remove();
            // Remove the note from the user's screen
            $('#' + id).parent().remove();
            // Close the view note modal
            $('#modal_view-note').modal('close');
        });
        // Listen for the close button in the new note modal to be used
        $('#button__close-view-note').click(function() {
            // Remove the id passed to the modal
            $('#modal_view-note').removeAttr('data-id');
            // Close the modal
            $('#modal_view-note').modal('close');
        });


        /*
            JQuery Handlers for work page
        */

        // Listen for the user to click the open datepicker button and open the datepicker
        $('#button__open-work-due-date-picker').click(function() {
            // Wait 250 milliseconds before closing
            setTimeout(function() {
                // Simulate a click on the close button
                $('#date__create-edit-work-due-date').trigger('click')
            }, 250);
        });
        // Listen for the close create-edit-work dialog button to be clicked
        $('#button__close-create-edit-work').click(function() {
            $('#modal__create-edit-work').modal('close');
            // Remove all possible data from textfields
            // Tell the textfields that they no longer have text
            $('#modal__create-edit-work label').removeClass('active');
            $('.create-edit-work-field').val('');
            // Tell the textfields that there is no data to be valid
            $('.create-edit-work-field').removeClass('valid');
            // Check if there is a work id tied to the modal
            if ($('#modal__create-edit-work').attr('data-id')) {
                // There is a work id tied to the modal
                // Remove the attribute
                $('#modal__create-edit-work').removeAttr('data-id');
            }
            // Tell the text fields to resize
            Materialize.updateTextFields();
        });
        // Listen for a click on the finish-create-edit-work button
        $('#button__finish-create-edit-work').click(function() {
            // Check if all the required fields are complete
            if (utilCheckFields('create-edit-work-required')) {
                // The required fields are complete
                // Set a variable to hold the work name
                var name = $('#text__create-edit-work-name').val();
                // Test if there is a class provided if so use the class name else use 'No Class' and store it in the workClass variable
                var workClass = $('#text__create-edit-work-class').val() ? $('#text__create-edit-work-class').val() : 'No Class';
                // Test if there details provided if so use the details provided else use 'Not Provided' and store it in the details variable
                var details = $('#text__create-edit-work-details').val() ? $('#text__create-edit-work-details').val() : 'Not Provided';
                // Utilize the moment library to create the due date and store it in a string based on the date, hour, minute, am / pm provided
                var due = moment($('#date__create-edit-work-due-date').val() +
                    ' ' + $('#number__work-hour-due').val() +
                    ':' + $('#number__work-minute-due').val() +
                    ' ' + $('#select__work-am-pm').val(), "D MMMM YYYY hh:mm a").toString();
                // Ensure that no fields are invalid
                if (!$('.work-time-field').hasClass('invalid')) {
                    // Test if any of the time fields have a value and there is not a date selected
                    if ($('.work-time-field').val() && !$('#date__create-edit-work-due-date').val()) {
                        // Both the fields are not filled
                        // Display a error message to the user for 5 seconds
                        Materialize.toast('Please select date!', 5000);
                    } else {
                        // Both the fields are filled
                        // Test if the modal does not have a work id attached to it
                        if (!$('#modal__create-edit-work').attr('data-id')) {
                            // Access Firebase 
                            firebase
                            // Access the database
                                .database()
                                // Get a reference to the users work directory
                                .ref('/users/' + firebase.auth().currentUser.uid + '/work/')
                                // Add new work
                                .push({
                                    // Work name
                                    name: name,
                                    // Class name
                                    class: workClass,
                                    // Work details
                                    details: details,
                                    // Due date if there is a valid one provided else 'No Due Date' will be used
                                    due: (due == "Invalid date") ? 'No Due Date' : due
                                }).then(function() {
                                    // The work has been added to the database
                                    // Close the create-edit-work modal
                                    $('#modal__create-edit-work').modal('close');
                                    // Tell the textfields that they no longer have text
                                    // Remove all text from the fields
                                    $('.create-edit-work-field').val('');
                                    // Tell the textfields that there is no data to be valid
                                    $('#modal__create-edit-work label').removeClass('active');
                                    // Trigger the textfields to resize
                                    Materialize.updateTextFields();
                                }).catch(function(e) {
                                    // There are errors handel them
                                    // Pass the error to the primary handeler
                                    FBErrorHandler(e);
                                    // Notify the user there was a problem
                                    Materialize.toast('There was a problem creating the work!', 5000)
                                });
                        } else {
                            // The modal does have a work id attached to it
                            // Access Firebase
                            firebase
                            // Access the database
                                .database()
                                // Get a reference to the users work directory
                                .ref('/users/' + firebase.auth().currentUser.uid + '/work/')
                                // Get the work
                                .child($('#modal__create-edit-work').attr('data-id'))
                                // Update the work with the new data
                                .set({
                                    // Name for the work
                                    name: name,
                                    // Class for the work
                                    class: workClass,
                                    // Details for the work
                                    details: details,
                                    // Due date if there is a valid one provided else 'No Due Date' will be used
                                    due: (due == "Invalid date") ? 'No Due Date' : due
                                }).then(function() {
                                    // Close the modal
                                    $('#modal__create-edit-work').modal('close');
                                    // Remove the text from the fields
                                    $('.create-edit-work-field').val('');
                                    // Tell the textfields that they no longer have text
                                    $('#modal__create-edit-work label').removeClass('active');
                                    // Tell the textfields to resize
                                    Materialize.updateTextFields();
                                }).catch(function(e) {
                                    // There are errors handel them
                                    // Pass the error to the primary handeler
                                    FBErrorHandler(e);
                                    // Notify the user there was a problem
                                    Materialize.toast('There was a problem updating the work!', 5000)
                                });
                        }
                    }
                } else {
                    // The required fields to set a due time were not provided
                    // Tell the user they need to complete all the time fields
                    Materialize.toast('Please enter a valid time!', 5000);
                }
                // Tell the textfields to resize
                Materialize.updateTextFields();
            } else {
                // All of the require information to create work was not provided
                // Tell the user to provide the required information
                Materialize.toast('Please enter a name!', 5000);
            }
        });


        /* 
            JQuery Handlers for classes page
        */
        // Listen for the user to click the  join class button
        $('.button__join-class').click(function() {
            // The user clicked the join class button
            // Open the join class modal
            $('#modal__join-class').modal('open');
        });
        // Listen for the user to finalize joining the class
        $('#button__commence-class-join').click(function() {
            // The user is ready to join a class
            // Test if the user completed all of the required fields
            if (utilCheckFields('join-class-required')) {
                // The user completed all of the required fields
                // Access Firebase
                firebase
                // Access the Database
                    .database()
                    // Get a reference to the classes section
                    .ref('/classes/')
                    // Try to get the class with the code provided
                    .child($('#text__join-class-code').val())
                    // Fetch the data once
                    .once('value', function(snapshot) {
                        // Test if the class code is valid
                        if (snapshot.exists()) {
                            // The class code is valid
                            // Test if the class is joinable
                            if (snapshot.val().data.joinable) {
                                // The class is joinable
                                // Access Firebase
                                firebase
                                // Access the database
                                    .database()
                                    // Get the classes people section
                                    .ref('/classes/' + $('#text__join-class-code').val() + '/people/')
                                    // Create a new entry with the users id
                                    .child(firebase.auth().currentUser.uid)
                                    // Add their name to the entry
                                    .set({
                                        // Use their name or Unknown Name if none could be found
                                        name: (firebase.auth().currentUser.displayName) ? firebase.auth().currentUser.displayName : 'Unknown Name'
                                    }).then(function() {
                                        // The operation succeded
                                        // Test if the user is a teacher
                                        if ($('.teacher').is(":visible")) {
                                            // The user is a teacher
                                            // Access Firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the users classes list
                                                .ref('/users/' + firebase.auth().currentUser.uid + '/classes/editable/')
                                                // Create an entry for the class
                                                .child($('#text__join-class-code').val())
                                                // Add excessive data to keep the entry 
                                                .set({
                                                    // Logical excessive data
                                                    joined: true
                                                })
                                                .then(function() {
                                                    // The operation succeded
                                                    // Close the join class modal
                                                    $('#modal__join-class').modal('close');
                                                    // Remove all data from the text fields
                                                    $('.join-class-required').val('');
                                                    // Tell the textfields that they are nolonger being used
                                                    $('#modal__join-class label').removeClass('active');
                                                    // Tell the textfields that there is no data to be valid
                                                    $('.create-edit-class-required').removeClass('valid invalid');
                                                    // Tell the textfields to resize
                                                    Materialize.updateTextFields();
                                                });
                                        } else if ($('.student').is(":visible")) {
                                            // The user is a student
                                            // Access the database
                                            firebase.database()
                                                // Get a reference to the users classes
                                                .ref('/users/' + firebase.auth().currentUser.uid + '/classes/')
                                                // Get the class
                                                .child($('#text__join-class-code').val())
                                                // Set meta data to make the entry stay
                                                .set({
                                                    joined: true
                                                }).then(function() {
                                                    // The data was set
                                                    // Close the modal
                                                    $('#modal__join-class').modal('close');
                                                    // Clear the text fields
                                                    $('.join-class-required').val('');
                                                    // Tell the textfields there is not text
                                                    $('#modal__join-class label').removeClass('active');
                                                    // Tell the textfields that there is no data to be valid
                                                    $('.create-edit-class-required').removeClass('valid invalid');
                                                    // Tell the textfields to resize
                                                    Materialize.updateTextFields();
                                                });
                                        }
                                    });
                            } else {
                                // The class is not joinable
                                // Tell the user they can't join the class
                                Materialize.toast('The class is not joinable at this time!', 5000);
                            }
                        } else {
                            // The join code isn't valid
                            // Tell the user the code is invalid
                            Materialize.toast('The join code is invalid!', 5000)
                        }
                    });
            } else {
                // There was no class code giver
                // Ask to user to enter a code
                Materialize.toast('Please supply a class join code!', 5000)
            }
        });
        // Listen for the user to click on the close join class button
        $('#button__close-join-class').click(function() {
            // Close the modal
            $('#modal__join-class').modal('close');
            // Remove the text from the text fields
            $('.join-class-required').val('');
            // Tell the text fields there are no longer text in them
            $('#modal__join-class label').removeClass('active');
            // Tell the textfields that there is no data to be valid
            $('.create-edit-class-required').removeClass('valid invalid');
            // Tell the textfields to resize
            Materialize.updateTextFields();
        });
        // Listen for the user to clickon the teachers create / edit class button
        $('#button_teacher-create-edit-class').click(function() {
            // Open the create / edit class modal
            $('#modal__create-edit-class').modal('open');
        });
        // Listen for the user to click the close create / edit class button
        $('#button__close-create-edit-class').click(function() {
            // Close the modal
            $('#modal__create-edit-class').modal('close');
            // Remove the text from the fields
            $('.create-edit-class-field').val('');
            // Tell the text fields they no longer have text
            $('#modal__create-edit-class label').removeClass('active');
            // Tell the textfields that there is no data to be valid
            $('.create-edit-class-field').removeClass('valid invalid');
            // Turn the joinability switch off
            $('#switch__joinability').removeAttr('checked');
            // Test if there is a id attached to the modal
            if ($('#modal__create-edit-class').attr('data-id')) {
                // There is a id attached to the modal
                // Remove the id from the modal
                $('#modal__create-edit-class').removeAttr('data-id');
            }
        });
        // Listen for the use to click the create new class button
        $('#button__create-new-class').click(function() {
            // Check if the user filled out the required fields
            if (utilCheckFields('create-edit-class-required')) {
                // The user completed all of the required fields
                // Test if the create edit class modal has an id attached to it
                if ($('#modal__create-edit-class').attr('data-id')) {
                    // The modal does have an id attached to it
                    // Access the database
                    firebase.database()
                        // Get a reference to the class
                        .ref('/classes/' + $('#modal__create-edit-class').attr('data-id'))
                        // Get the classes data
                        .child('/data/')
                        // Update the data
                        .update({
                            // Set its name to the new name
                            name: $('#text__create-edit-class-name').val(),
                            // Set its joinability to the new joinability
                            joinable: $('#switch__joinability').is(':checked'),
                            // Set its descriptior to the new descriptor
                            descriptor: ($('#text__new-class-descriptor').val().length !== 0) ? $('#text__new-class-descriptor').val() : 'No Descriptor'
                        });
                    // Access the database
                    firebase.database()
                        // Get a reference to the users classes
                        .ref('/users/' + firebase.auth().currentUser.uid + '/classes/owner/')
                        // Get the class
                        .child($('#modal__create-edit-class').attr('data-id'))
                        // Update the name
                        .set({
                            name: $('#text__create-edit-class-name').val()
                        });
                } else {
                    // There is no data attached to the modal
                    // Store a database action in the variable newClass 
                    var newClass =
                        // Access the database
                        firebase.database()
                        // Get a reference to the classes directory
                        .ref('/classes/')
                        // Make a new class
                        .push({
                            // Set its data
                            data: {
                                // Set the owner
                                owner: firebase.auth().currentUser.uid,
                                // Set the name
                                name: $('#text__create-edit-class-name').val(),
                                // Set the joinability
                                joinable: $('#switch__joinability').is(':checked'),
                                // Set the descriptor if there is one
                                descriptor: ($('#text__new-class-descriptor').val().length !== 0) ? $('#text__new-class-descriptor').val() : 'No Descriptor'
                            }
                        });
                    // Access the database
                    firebase.database()
                        // Get a reference to the class
                        .ref('/classes/' + newClass.getKey())
                        // Get the classes data
                        .child('data')
                        // Update the classes data
                        .update({
                            // Set the classes id
                            id: newClass.getKey()
                        })
                        // Access the database
                    firebase.database()
                        // Get a reference to the users classes
                        .ref('/users/' + firebase.auth().currentUser.uid + '/classes/owner/')
                        // Get the class
                        .child(newClass.getKey())
                        // Set the classes data
                        .set({
                            // Set the name
                            name: $('#text__create-edit-class-name').val()
                        });
                }
                // Access the database
                firebase.database()
                    // Get a reference to the users classes
                    .ref('/users/' + firebase.auth().currentUser.uid + '/classes/owner/')
                    // Get the classes id from the modal or the new class
                    .child($('#modal__create-edit-class').attr('data-id') ? $('#modal__create-edit-class').attr('data-id') : newClass.getKey())
                    // Set the classes data
                    .set({
                        // Set the name
                        name: $('#text__create-edit-class-name').val()
                    });
                // Close the modal
                $('#modal__create-edit-class').modal('close');
                // Remove the text from the fields
                $('.create-edit-class-field').val('');
                // Tell the text fields that there is no longer text in them
                $('#modal__create-edit-class label').removeClass('active');
                // Tell the textfields that there is no data to be valid
                $('.create-edit-class-field').removeClass('valid invalid');
                // Tell the textfields to resize
                Materialize.updateTextFields();
                // Un switch the switch
                $('#switch__joinability').removeAttr('checked');
                // Check if there is an id attached to the modal
                if ($('#modal__create-edit-class').attr('data-id')) {
                    // There is a id attached to the modal
                    // Remove the id from the modal
                    $('#modal__create-edit-class').removeAttr('data-id');
                }
            } else {
                // The user did not fill out all of the required fields
                // Ask to user to fill out the fields
                Materialize.toast('Please set a name for the class!', 5000);
            }
        });


        /* 
            JQuery Handlers for discussion page
        */
        // Declare a variable to dictate the user ability to send messages
        var allowedToSend = true;
        // Listen for a key to be pressed in the new message text field
        $('#discussion__new-message-text').keydown(function(event) {
            // Test if it is the enter key
            if (event.which == 13) {
                // It was the enter key that was pressed
                // Check if the message is valid
                if (!$('#discussion__new-message-text').hasClass('invalid')) {
                    // The message is valid
                    // Test if there is a message
                    if ($.trim($('#discussion__new-message-text').val()).length !== 0) {
                        // There is a message
                        // Check if the user is allowed to send messages
                        if (allowedToSend) {
                            // The user is allowed to send messages
                            // Access firebase
                            firebase
                            // Access the database
                                .database()
                                // Get a reference to the discussion directory
                                .ref('/discussions/')
                                // Get the discussion with the id passed
                                .child($('#class__discussion').attr('data-id'))
                                // Push a new message
                                .push({
                                    // Set the text of the message
                                    text: $(this).val(),
                                    // Set the users name if they have one
                                    author: firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName : 'Unknown'
                                });
                            // Clear the text fields value
                            $('#discussion__new-message-text').val('');
                            // Tell the text field to resize
                            Materialize.updateTextFields();
                            // Declare that the user is not allowed to send messages
                            allowedToSend = false;
                            // Wait one second
                            setTimeout(function() {
                                // Declare that the user is allowed to send messages
                                allowedToSend = true;
                            }, 1000);
                        } else {
                            // The user is not currently allowed to send messages
                            // Tell the user to wait between messages
                            Materialize.toast('Wait a second between messages!', 5000);
                        }
                    } else {
                        // The user did not type a message
                        // Ask the user to type a message
                        Materialize.toast('Please type a message!', 5000);
                    }
                } else {
                    // The users message wasn't valid
                    // Tell the user that there message is too long
                    Materialize.toast('Your message is too long!', 5000);
                }
            }
        });
        // Listen for the user to click the exit discussion button
        $('#button__exit-discussion').click(function() {
            // Fade out the button
            $("#button__exit-discussion").fadeOut();
            // Fade out the discussion view
            $('#class__discussion').fadeOut(function() {
                // The discussion has faded out fade the classes list in
                $('#discussion-wrapper').fadeIn();
            });
            // Access firebase
            firebase
            // Access the database
                .database()
                // Get a reference to the discussion with the id provided
                .ref('/discussions/' + $('#class__discussion').attr('data-id'))
                // Stop listening for new messages
                .off('child_added');
            // Remove all messages
            $('#discussion__messages').empty();
            // Remove the id attached to the discussion view
            $('#class__discussion').removeAttr('data-id');
        });

        /*
            JQuery handlers for the settings page
        */
        // Listen for the user to click the delete account button
        $('#button__delete-account').click(function() {
            // Check if the delete account switch is toggled
            if ($('#switch__delete-account').is(':checked')) {
                // Access firebase
                firebase
                // Access the database
                    .database()
                    // Get a reference to the users directory
                    .ref('/users/' + firebase.auth().currentUser.uid)
                    // Get the users classes
                    .child('/classes')
                    // Retrive the classes
                    .once('value', function(snapshot) {
                        // Itterate through each class
                        snapshot.forEach(function(childSnapshot) {
                            // Access firebase
                            firebase
                            // Access the database
                                .database()
                                // Get a reference to the classes people
                                .ref('/classes/' + childSnapshot.key + '/people/')
                                // Get the user
                                .child(firebase.auth().currentUser.uid)
                                // Remove the user
                                .remove()
                                // Catch any errors
                                .catch(FBErrorHandler);
                        });
                    });
                // Access firebase
                firebase
                // Access the database
                    .database()
                    // Get a reference to the users directory
                    .ref('/users/')
                    // Get the user
                    .child(firebase.auth().currentUser.uid)
                    // Remove the user
                    .remove()
                    // Catch any errors
                    .catch(FBErrorHandler);
                // Access firebase
                firebase
                // Access authentication
                    .auth()
                    // Get the current user
                    .currentUser
                    // Delete the user
                    .delete();
            } else {
                // The user didn't confirm by switching the switch
                // Tell the user the need to check the switch to delete their account
                Materialize.toast('Check delete account switch to delete your account!', 5000)
            }
        });

        /*
            All Firebase handlers / initiators are here
        */
        // Initialize the Firebase app script
        firebase.initializeApp(FirebaseConfig);

        firebase.auth().getRedirectResult().catch(FBErrorHandler);
        // Wait for changed in the user authentication and fire on page load
        firebase.auth().onAuthStateChanged(function(user) {
            // There is a user account logged in
            if (user) {
                // Hide elements with the class no-auth
                $('.no-auth').fadeOut(function() {
                    // Show elements with the class auth
                    $('.auth').fadeIn();
                });
                // Declare a variable to hold the users name or no name if there is none
                var name = firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName : 'Not Provided';
                // Update the name areas in the ui with the name in the users base
                $('.area__menu-name').text(name);
                // Update the email area in the ui with the email in the users base
                $('.area__menu-email').text(firebase.auth().currentUser.email);
                firebase.database()
                    // Get a reference to the user directory
                    .ref('/users/' + firebase.auth().currentUser.uid)
                    // Retive the data once
                    .once('value')
                    // Handel the data recived
                    .then(function(snapshot) {
                        // The data had been sucessfully recived
                        if (!snapshot.val()) {
                            // The user does not have a directory
                            $('.section__account-setup').fadeIn();
                        } else {
                            // The user has a directory
                            // Check if the user is a teacher
                            if (snapshot.val().type == 'teacher') {
                                // The user is a teacher
                                // Fade in any teacher only elements
                                $('.teacher').fadeIn();
                                // Check if the page is Classes or Discussion
                                if ($('.brand-logo').text() == 'Classes' || $('.brand-logo').text() == 'Discussion') {
                                    // Declare a variable to hold the correct handler
                                    var handler = $('.brand-logo').text() == 'Classes' ? ClassHandler : DiscussionHandler;
                                    // Access firebase
                                    firebase
                                    // Access the database
                                        .database()
                                        // Get a reference the users classes
                                        .ref('/users/' + firebase.auth().currentUser.uid + '/classes/owner/')
                                        // Wait for a child to be added or any that are currently present
                                        .on('child_added', function(snapshot) {
                                            // Access the firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the classes directory
                                                .ref('/classes/')
                                                // Get the class
                                                .child(snapshot.key)
                                                // Retreive the classes data
                                                .once('value')
                                                .then(function(classSnap) {
                                                    // Check if there is not a class
                                                    if (classSnap.val() == null) {
                                                        // Access firebase
                                                        firebase
                                                        // Access the database
                                                            .database()
                                                            // Get a reference to the users classes
                                                            .ref('/users/' + firebase.auth().currentUser.uid + '/classes/owner/')
                                                            // Get the class
                                                            .child(snapshot.key)
                                                            // Remove the class
                                                            .remove();
                                                    } else {
                                                        // The class does have data
                                                        // Check if it is the classes page
                                                        if ($('.brand-logo').text() == 'Classes') {
                                                            // It is the classes page
                                                            // Fade out the no message message
                                                            $('#message__no-classes').fadeOut(function() {
                                                                // Add the class to the handler
                                                                handler.classes.push({
                                                                    // Set the id
                                                                    id: snapshot.key,
                                                                    // Set the details
                                                                    details: classSnap.val().data
                                                                });
                                                            });
                                                        } else {
                                                            // It is the discussion page
                                                            // Fade the no classes message out
                                                            $('#message__no-classes').fadeOut(function() {
                                                                // Fade the discussion wrapper in
                                                                $('#discussion-wrapper').fadeIn();
                                                                // Add a new class
                                                                handler.classes.push({
                                                                    // Set the id
                                                                    id: snapshot.key,
                                                                    // Set the details
                                                                    details: classSnap.val().data
                                                                });
                                                            });
                                                        }
                                                    }
                                                });
                                            // Access firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the classes directory
                                                .ref('/classes/')
                                                // Get the class
                                                .child(snapshot.key)
                                                // Listen for the class to be changed
                                                .on('child_changed', function(cls) {
                                                    // Check if the change is the details
                                                    if (cls.key == 'details') {
                                                        // Declare the classes index
                                                        var indx;
                                                        // Declare the classes id
                                                        var identification = cls.val().id;
                                                        // Search for the class by id
                                                        handler.classes.map(function(obj, index) {
                                                            // Check if the its the correct class
                                                            if (obj.id == identification) {
                                                                // Set the index of the class
                                                                indx = index;
                                                            }
                                                        });
                                                        // Update the class in the handler
                                                        handler.$set(handler.classes[indx], 'details', cls.val());
                                                    }
                                                });
                                        });
                                    // Access firebase
                                    firebase
                                    // Access the database
                                        .database()
                                        // Get a reference to editable classes
                                        .ref('/users/' + firebase.auth().currentUser.uid + '/classes/editable/')
                                        // Wait for a child to be added or the current childs to be loaded
                                        .on('child_added', function(snapshot) {
                                            // Access firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the classes
                                                .ref('/classes/')
                                                // Get the class
                                                .child(snapshot.key)
                                                // Get the classes data
                                                .once('value')
                                                .then(function(classSnap) {
                                                    // Add a new class to the handler
                                                    handler.classes.push({
                                                        // Set the id
                                                        id: snapshot.key,
                                                        // Set the data
                                                        details: classSnap.val().data
                                                    });
                                                });
                                            // Access firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the classes directory
                                                .ref('/classes/')
                                                // Get the class
                                                .child(snapshot.key)
                                                // Wait for a child to be changed or handle the current ones
                                                .on('child_changed', function(cls) {
                                                    // Set a varibales to contain the classes index
                                                    var indx;
                                                    // Set a variable to contain the classes id
                                                    var identification = cls.val().id;
                                                    // Itterate through the classes
                                                    handler.classes.map(function(obj, index) {
                                                        // Test if the class is the correct one
                                                        if (obj.id == identification) {
                                                            // Set the index of the class
                                                            indx = index;
                                                        }
                                                    });
                                                    // Update the class
                                                    handler.$set(handler.classes[indx], 'details', cls.val());
                                                });
                                        });
                                }
                            } else {
                                // The user is a student
                                // Fade in student only elements
                                $('.student').fadeIn();
                                // Check if the page is Classes or Discussion
                                if ($('.brand-logo').text() == 'Classes' || $('.brand-logo').text() == 'Discussion') {
                                    // Declare the handler
                                    var handler = $('.brand-logo').text() == 'Classes' ? ClassHandler : DiscussionHandler;
                                    // Tell the handler the user is not a teacher
                                    handler.teacher = false;
                                    // Access firebase
                                    firebase
                                    // Access the database
                                        .database()
                                        // Get a reference to the users classes
                                        .ref('/users/' + firebase.auth().currentUser.uid + '/classes/')
                                        // Wait for a child to be added or handle the current ones
                                        .on('child_added', function(snapshot) {
                                            // Access firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the classes directory
                                                .ref('/classes/')
                                                // Get the class
                                                .child(snapshot.key)
                                                // Retreive its data
                                                .once('value')
                                                .then(function(classSnap) {
                                                    // Check if the class exsists
                                                    if (classSnap.val() == null) {
                                                        // The class does not exists
                                                        // Access firebase
                                                        firebase
                                                        // Access the database
                                                            .database()
                                                            // Get a reference to the users classes directory
                                                            .ref('/users/' + firebase.auth().currentUser.uid + '/classes/')
                                                            // Get the class
                                                            .child(snapshot.key)
                                                            // Remove the class
                                                            .remove()
                                                            // Catch any errors
                                                            .catch(FBErrorHandler);
                                                    } else {
                                                        // The class does exist
                                                        // Fade out the no classes message
                                                        $('#message__no-classes').fadeOut(function() {
                                                            // Pass the class to the handler
                                                            handler.classes.push({
                                                                // Set the id
                                                                id: snapshot.key,
                                                                // Set the details
                                                                details: classSnap.val().data
                                                            });
                                                            // Fade in the discussion wrapper
                                                            $('#discussion-wrapper').fadeIn();
                                                        });
                                                    }
                                                });
                                            // Access firebase
                                            firebase
                                            // Access the database
                                                .database()
                                                // Get a reference to the classes directory
                                                .ref('/classes/')
                                                // Get the class
                                                .child(snapshot.key)
                                                // Wait for a child to be changed or handle the current ones
                                                .on('child_changed', function(cls) {
                                                    // Check if the change is the details
                                                    if (cls.key == 'details') {
                                                        // The Change is the details
                                                        // Declare the index of the class
                                                        var indx;
                                                        // Declare the id
                                                        var identification = cls.val().id;
                                                        // Itterate through the classes in the handler
                                                        handler.classes.map(function(obj, index) {
                                                            // Check if the class is the correct one
                                                            if (obj.id == identification) {
                                                                // Set the classes index
                                                                indx = index;
                                                            }
                                                        });
                                                        // Update the classes
                                                        handler.$set(handler.classes[indx], 'details', cls.val());
                                                    }
                                                });
                                        });
                                }
                            }
                        }
                    });

                // Create a switch statement to add different handeling for different pages judging with the page title
                switch ($('.brand-logo').text()) {

                    /*
                      Handler for the discussion page
                    */
                    case 'Discussion':
                        // Declare the handler
                        var DiscussionHandler = new Vue({
                            // Set the element to the element with the id discussion wrapper
                            el: '#discussion-wrapper',
                            // Set default data and create a template
                            data: {
                                classes: [],
                                teacher: true
                            },
                            // Add methods to be used in the templates
                            methods: {
                                // Method to enter a discussion by passing a note id
                                enterDiscussion: function(id) {
                                    // Fade out the discussion wrapper
                                    $('#discussion-wrapper').fadeOut(function() {
                                        // Fade in the class discussion section
                                        $('#class__discussion').fadeIn();
                                        // Fade in the exit class button
                                        $("#button__exit-discussion").fadeIn();
                                    });
                                    // Pass the id of the class
                                    $('#class__discussion').attr('data-id', id);
                                    // Access firebase
                                    firebase
                                    // Access the database
                                        .database()
                                        // Get a reference to the discussion
                                        .ref('/discussions/' + id)
                                        // Wait for messages to be added / handle the current ones
                                        .on('child_added', function(snapshot) {
                                            // Test if the user is a teacher
                                            if (DiscussionHandler.teacher) {
                                                // The user is a teacher
                                                // Append a message with a delete button
                                                $('#discussion__messages').append("<li class=\"collection-item discussion__message\" id=\"" + snapshot.key + "\"><span class=\"message__name\">" + snapshot.val().author + "</span><div>" + snapshot.val().text + "<a href=\"#!\" class=\"secondary-content red-text button__delete-message\"><i class=\"material-icons\">delete</i></a></div></li>");
                                            } else {
                                                // The user is not a teacher
                                                // Append a message
                                                $('#discussion__messages').append("<li class=\"collection-item discussion__message\" id=" + snapshot.key + "><span class=\"message__name\">" + snapshot.val().author + "</span><div>" + snapshot.val().text + "</div></li>");
                                            }
                                            // Scroll the messages down
                                            $('#discussion__messages').scrollTop($(this).prop("scrollHeight"));
                                            // Listen for the user to click the delete message button
                                            $('.button__delete-message').click(function() {
                                                // Decalre the message id
                                                var messageID = $(this).parent().parent().prop('id');
                                                // Access firebase
                                                firebase
                                                // Access the database
                                                    .database()
                                                    // Get a reference to the discussion
                                                    .ref('/discussions/' + id)
                                                    // Get the message
                                                    .child(messageID)
                                                    // Remove the message
                                                    .remove();
                                            });
                                        });
                                    // Access firebase
                                    firebase
                                    // Access the database
                                        .database()
                                        // Get a reference to the discussion
                                        .ref('/discussions/' + id)
                                        // Wait for a child to be removed
                                        .on('child_removed', function(oldChildSnapshot) {
                                            // Remove the message
                                            $('#' + oldChildSnapshot.key).remove();
                                        });
                                }
                            }
                        });
                        // End end discussion handler
                        break;


                        /*
                            Handler for the classes page
                        */
                    case 'Classes':
                        // Declare the class handler 
                        var ClassHandler = new Vue({
                            // Tell the handler what element should be used
                            el: '#classes-wrapper',
                            // Create a template data set for the element
                            data: {
                                classes: [],
                                teacher: true
                            },
                            // Add methods to be used in the templates
                            methods: {
                                // Add a method to delete a class by passing its id
                                deleteClass: function(id) {
                                    // Check if the user is a teacher
                                    if ($('.teacher').is(":visible")) {
                                        // The teacher is a user
                                        // Access firebase
                                        firebase
                                        // Access the database
                                            .database()
                                            // Get a reference to the classes directory
                                            .ref('/classes/')
                                            // Get the class
                                            .child(id)
                                            // Remove the class
                                            .remove();
                                        // Access firebase
                                        firebase
                                        // Access the database
                                            .database()
                                            // Get a reference to the users classes
                                            .ref('/users/' + firebase.auth().currentUser.uid + '/classes/owner/')
                                            // Get the class
                                            .child(id)
                                            // Remove the class
                                            .remove();
                                    } else {
                                        // The user is a student
                                        firebase
                                        // Access the database
                                            .database()
                                            // Get a reference to the users classes
                                            .ref('/users/' + firebase.auth().currentUser.uid + '/classes/')
                                            // Get the class
                                            .child(id)
                                            // Remove the class
                                            .remove();
                                    }
                                    // Remove the class from the lust
                                    $('#' + id).remove();
                                },
                                // Add a method to edit a class by passing its id  and details
                                editClass: function(id, details) {
                                    // Pass the id to the modal
                                    $('#modal__create-edit-class').attr('data-id', id)
                                        // Put the name in the name text field
                                    $('#text__create-edit-class-name').val(details.name);
                                    // Put the descriptor in the descriptor text field
                                    $('#text__new-class-descriptor').val(details.descriptor)
                                        // Check if the class is joinable
                                    if (details.joinable) {
                                        // The class is joinable
                                        // Toggle the switch on
                                        $('#switch__joinability').prop('checked', true);
                                    }
                                    // Open the modal
                                    $('#modal__create-edit-class').modal('open');
                                    // Tell the text fields to resize
                                    Materialize.updateTextFields();
                                }
                            }
                        });
                        // End the class handler
                        break;


                        /*
                            Handler for the notes page
                        */
                    case 'Notes':
                        // Create a new note handler with the Vue library
                        var NotesHandler = new Vue({
                            // Tell the handler what element should be used
                            el: '#notes-wrapper',
                            // Create a template data set for the element
                            data: {
                                notes: [],
                            },
                            // Define the methods to be used with the notes
                            methods: {
                                // Create a method to view the note the button was clicked on
                                viewNote: function(id) {
                                    // Set a variable to contain the name of the note
                                    var name = $('#' + id + ' .card-title').text();
                                    // Set a variable to contain the message of the note
                                    var message = $('#' + id + ' p').text();
                                    // Pass the note id to the view note modal
                                    $('#modal_view-note').attr('data-id', id);
                                    // Set the note title of the view note modal
                                    $('#modal_view-note h4').text(name);
                                    // Set the note message of the niew note modal
                                    $('#modal_view-note p').text(message);
                                    // Open the view note modal
                                    $('#modal_view-note').modal('open');
                                },
                                // Create a method to edit the note the button was clicked on
                                editNote: function(id, name, message) {
                                    // Pass the message id to the edit note modal
                                    $('#modal_create-edit-note').attr('data-id', id);
                                    // Set the title of the edit note modal
                                    $('#text__create-edit-note-name').val(name);
                                    // Set the message of the edit note modal
                                    $('#textarea__create-edit-note-text').val(message);
                                    // Tell the edit note modal text fields that theirs text in them
                                    $('#modal_create-edit-note label').addClass('active');
                                    // Tell the edit note modal message textared to update its size to the text
                                    $('#textarea__create-edit-note-text').trigger('autoresize');
                                    // Open the edit note modal
                                    $('#modal_create-edit-note').modal('open');
                                },
                                // Create a method to delete the note the button was clicked on
                                deleteNote: function(id) {
                                    firebase.database()
                                        // Get a reference to the users notes directory
                                        .ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                                        // Get the note
                                        .child(id)
                                        // Delete / remove the note
                                        .remove();
                                    // Remove the note from the users screen
                                    $('#' + id).parent().remove();
                                },
                            },
                        });
                        firebase.database()
                            // Get a reference to the users notes directory
                            .ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                            // Listen for a new note to be added / handel the current notes
                            .on('child_added', function(snapshot) {
                                // A new note has been added
                                // Send the notes data to the note handler
                                NotesHandler.notes.push({
                                    // Set the id of the note
                                    id: snapshot.key,
                                    // Set the name / message of the note
                                    details: snapshot.val(),
                                });
                            });
                        firebase.database()
                            // Get a reference to the users notes directory
                            .ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                            // Listen for a note to be changed
                            .on('child_changed', function(snapshot) {
                                // Declare a varible to contain the notes index
                                var indx;
                                // Declare a variable to contian the notes id
                                var key = snapshot.key;
                                // Itterate through the notes
                                NotesHandler.notes.map(function(obj, index) {
                                    // Check if the object 
                                    if (obj.id == key) {
                                        // Set the index of the note
                                        indx = index;
                                    }
                                });
                                // Update the note
                                NotesHandler.$set(NotesHandler.notes[indx], 'details', snapshot.val());
                            });
                        // Access firebase
                        firebase
                        // Access the database
                            .database()
                            // Get a reference to the users notes directory
                            .ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                            // Listen for a note to be removed
                            .on('child_removed', function(snapshot) {
                                // Set a variable to contain the id of the note
                                var id = snapshot.key;
                                // Remove the note from the users screen
                                $('#' + id).parent().remove();
                            });
                        // End the notes handler 
                        break;


                        /*
                            Handler for the work page
                        */
                    case 'Work':
                        // Declare the work handler
                        var AssignmentsHandler = new Vue({
                            // Tell the handler what element should be used
                            el: '#work-wrapper',
                            // Create a template data set for the element
                            data: {
                                work: [],
                            },
                            // Declare methods to be used in the template
                            methods: {
                                // Declare a method to view work by passing its id and details
                                viewWork: function(id, details) {
                                    // Set the title of the work
                                    $("#view-work_title").text('Name - ' + details['name']);
                                    // Set the class for the work
                                    $('#view-work_class').text('Class - ' + details['class']);
                                    // Set the details of the work
                                    $('#view-work_details').text(details['details']);
                                    // Set the due date of the work
                                    $('#view-work_due').text(details['due']);
                                    // Open the modal
                                    $('#modal__view-work').modal('open');
                                },
                                // Declare a method to delete work by passing its id
                                deleteWork: function(id) {
                                    // Remove the work
                                    $('#' + id).remove();
                                    // Access firebase
                                    firebase
                                    // Access the database
                                        .database()
                                        // Get a reference to the users work directory
                                        .ref('/users/' + firebase.auth().currentUser.uid + '/work/')
                                        // Get the note
                                        .child(id)
                                        // Remove the note
                                        .remove();
                                },
                                // Declare a method to edit work by passing its id and details
                                editWork: function(id, details) {
                                    // Pass the id to the modal
                                    $('#modal__create-edit-work').attr('data-id', id);
                                    // Set the works name
                                    $('#text__create-edit-work-name').val(details.name);
                                    // Set the works class
                                    $('#text__create-edit-work-class').val(details.class);
                                    // Set the works details
                                    $('#text__create-edit-work-details').val(details.details);
                                    // Tell the text fields to resize
                                    Materialize.updateTextFields();
                                    // Open the modal
                                    $('#modal__create-edit-work').modal('open');
                                },
                            },
                        });
                        // Access firebase
                        firebase
                        // Access the database
                            .database()
                            .ref('/users/' + firebase.auth().currentUser.uid + '/work/')
                            .once('value')
                            .then(function(snapshot) {
                                if (!snapshot.hasChildren()) {
                                    $('.progress').hide();
                                }
                            });
                        // Access firebase
                        firebase
                        // Access the database
                            .database()
                            // Get a reference to the users work directory
                            .ref('/users/' + firebase.auth().currentUser.uid + '/work/')
                            // Listen for a new note to be added / handel the current notes
                            .on('child_added', function(snapshot) {
                                // A new note has been added
                                // Send the notes data to the note handler
                                AssignmentsHandler.work.push({
                                    // Set the id of the note
                                    id: snapshot.key,
                                    // Set the name / message of the note
                                    details: snapshot.val(),
                                });
                                // Hide the progress bar
                                $('.progress').hide();
                                // Show the work list
                                $('#work-wrapper').show();
                            });
                        // Access firebase
                        firebase
                        // Access the database
                            .database()
                            // Get a reference to the users work directory
                            .ref('/users/' + firebase.auth().currentUser.uid + '/work/')
                            // Wait for a child to be changed 
                            .on('child_changed', function(snapshot) {
                                // Declare the works index
                                var indx;
                                // Declare the works id
                                var key = snapshot.key;
                                // Itterate through the work
                                AssignmentsHandler.work.map(function(obj, index) {
                                    // Check if the work is the correct one
                                    if (obj.id == key) {
                                        // Sey the index to the current works index
                                        indx = index;
                                    }
                                });
                                // Update the work
                                AssignmentsHandler.$set(AssignmentsHandler.work[indx], 'details', snapshot.val());
                            });
                        // End the work handler
                        break;


                        /*
                            Handler for the login page
                        */
                    case 'Login':
                        // Redirect to the home page
                        window.location.href = window.location.origin;
                        // End the login page handler
                        break;
                }
            } else {
                // The user is no logged in
                // Hide elements with the auth class
                $('.auth').fadeOut(function() {
                    // Show elements with the no-auth class
                    $('.no-auth').fadeIn();
                });
                // Hide the side nav
                $('.button-collapse').sideNav('hide');
            }
        });
    });
}());