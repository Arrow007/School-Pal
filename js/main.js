(function() {
  'use strict';

  /*
    All functions are defined here
  */
  // Create a function to check single line text fields for completion
  function utilCheckFields(className) {
    // Declare a variable to be return with the default value of false
    var valid = true;
    // Itterate through elements with class name given
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

  // Create a functions to handel dispalying error to the user
  function showError(message) {
    // Create a message on the users screen with red text starting with ERROR followed by the message passed
    Materialize.toast('ERROR ' + message, 5000, 'red-text');
    // Log the error given to the console
    console.error('Message: ' + message);
  }

  // Create a function to handel errors thrown by firebase
  function FBErrorHandeler(error) {
    // Create a switch statement to handel the errors based on their code
    switch (error.code) {
      // Default error handeler if their is no specific instructions specified
      case 'auth/app-deleted':
        // Display an message to the user specific to the error
        showError('There had been an error with the code possibly cause by you');
        // End the handeler
        break;
      case 'auth/app-not-authorized':
        // Display an message to the user specific to the error
        showError('Either we made a mistake or this is not a genuine site');
        // End the handeler
        break;
      case 'auth/argument-error':
        // Display an message to the user specific to the error
        showError('Oops there was an error in our code');
        // End the handeler
        break;
      case 'auth/invalid-api-key':
        // Display an message to the user specific to the error
        showError('Either we made a mistake, you messed with the code or this is not a genuine site');
        // End the handeler
        break;
      case 'auth/invalid-user-token':
        // Display an message to the user specific to the error
        showError('We will now log you out and redirect you to the login page');
        // Sign the user out of the app
        firebase.auth().signOut()
          .then(function() {
            // The user was signed out sucessfully
            // Redirect the user to the login page
            window.location.pathname = window.location.pathname.split('/')[1] + '/login/index.html';
            $('.no-auth').hide();
          });
        // End the handeler
        break;
      case 'auth/network-request-failed':
        // Display an message to the user specific to the error
        showError('Network issue');
        // End the handeler
        break;
      case 'auth/operation-not-allowed':
        // Display an message to the user specific to the error
        showError('Either we made a mistake, you messed with the code or this is not a genuine site');
        // End the handeler
        break;
      case 'auth/requires-recent-login':
        // Display an message to the user specific to the error
        showError('We will now log you out and redirect you to the login page');
        // Sign the user out of the app
        firebase.auth().signOut()
          .then(function() {
            // The user was signed out sucessfully
            // Redirect the user to the login page
            window.location.pathname = window.location.pathname.split('/')[1] + '/login/index.html';
          });
        // End the handeler
        break;
      case 'auth/too-many-requests':
        showError('The server has detected that you are sending too many requests to the server');
        // End the handeler
        break;
      case 'auth/unauthorized-domain':
        // Display an message to the user specific to the error
        showError('Either we made a mistake, you messed with the code or this is not a genuine site');
        // End the handeler
        break;
      case 'auth/user-disabled':
        // Display an message to the user specific to the error
        showError('Your account has been disable this is probably due to inapropriate usage');
        // End the handeler
        break;
      case 'auth/user-token-expired':
        // Display an message to the user specific to the error
        showError('We will now log you out and redirect you to the login page');
        // Sign the user out of the app
        firebase.auth().signOut()
          .then(function() {
            // The user was signed out sucessfully
            // Redirect the user to the login page
            window.location.pathname = '/login/index.html';
          });
        // End the handeler
        break;
      case 'auth/web-storage-unsupported':
        // Display an message to the user specific to the error
        showError('Please upgrade your browser');
        // End the handeler
        break;
      case 'auth/email-already-in-use':
        // Display an message to the user specific to the error
        showError('The email entered is already being used');
        // End the handeler
        break;
      case 'auth/invalid-email':
        // Display an message to the user specific to the error
        showError('The email address provided is invalid');
        // End the handeler
        break;
      case 'auth/weak-password':
        // Display an message to the user specific to the error
        showError('Please use a stronger password');
        // End the handeler
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
      Initialize elements to their appropriate handelers
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
    // Initialize the modals and prevent close on click off
    $('.modal').modal({
      dismissible: false,
    });
    // Initialize the chip elemets
    $('.chips').material_chip();
    $('.datepicker').pickadate({
      selectMonths: true,
      format: 'dd mmmm yyyy'
    });

    /*
      JQuery handelers for login page
    */

    // Listen for a click on the Login button element
    $('#button__login-password').click(function() {
      // Call the utilCheckFields function to check if all the fields with the class login_field are filled out
      if (utilCheckFields('login__field')) {
        // The login fields are completed with data
        // Attempt to authenticate the user with an email and password
        firebase.auth().signInWithEmailAndPassword($('#text__login-email').val(), $('#text__login-email').val())
          // Catch any errors thrown and feed them to the error handeler
          .catch(FBErrorHandeler);
      } else {
        // The login fields aren't comepleted with data
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
            // Catch any errors thrown and feed them to the error handeler
            .catch(FBErrorHandeler)
            // Create a function to be called when the user account is created sucessfully
            .then(function() {
              // The user account was created sucessfully
              firebase.auth().currentUser.updateProfile({
                  // Update the users name
                  displayName: $('#text__signup-first-name').val() + ' ' + $('#text__signup-last-name').val(),
                })
                // Catch any errors thrown and feed them to the error handeler
                .catch(FBErrorHandeler);
              // Send a verification email to the user
              firebase.auth().currentUser.sendEmailVerification()
                // Catch any errors thrown and feed them to the error handeler
                .catch(FBErrorHandeler);
              // Redirect the user back to the home page
              window.location.href = window.location.origin + '/' + window.location.pathname.split('/')[1]
            });
        } else {
          // The passwords didn't match each other
          // Create a message on the users screen stating that the passwords didn't match
          Materialize.toast('The passwords entered do not match!', 5000);
        }
      } else {
        // The signup fields aren't completed with data
        // Create a message to tell the user that not all of the fields are complete
        Materialize.toast('Please fill out all of the visible fields!', 5000);
      }
    });


    /*
      JQuery handelers for all pages
    */
    // Wait for the user to click the submit button for their account setup data
    $('#button_submit-account-setup').click(function() {
      // Check if the text field contians text
      if ($.trim($('#textarea__reason-for-use').val()).length !== 0) {
        // The text field does contain text
        // Log the reason for use on the database
        firebase.database().ref('/analytics/').push({
          reason: $('#textarea__reason-for-use').val(), // Get the reason provided
          date: new Date(), // Get the current date and time
          user: firebase.auth().currentUser.uid, // Get the users uid
        });
      }
      // Create a new user in the database to hold the users data
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).set({
        type: $('#select__account-type').val(), // Get the account type either teacher or student
        created: new Date(), // Get the current date and time
      }).then(function() {
        // The data was sucessfully written to the data base
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
      JQuery handelers for notes page
    */

    // Wait for the user to click the ok button on the bottom of the create / edit note moal
    $('#button__finish-create-edit-note').click(function() {
      // Check if there is a note id passed to the modal indicating the user is editing a note
      if ($('#modal_create-edit-note').attr('data-id')) {
        // There is a note id passed to the modal
        // Get the users notes directory in the database
        firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
          // Get the note with the id passed to the modal
          .child($('#modal_create-edit-note').attr('data-id')).set({
            name: $('#text__create-edit-note-name').val(), // Get the name(title) of the note
            message: $('#textarea__create-edit-note-text').val(), // Get the message(text) of the note
          });
        $('#modal_create-edit-note').modal('close');
        // Remove the text from the create / edit note modal
        $('.create-edit-note-required').val('');
        // Tell the text field labels that there is no longer text in the text fields
        $('#modal_create-edit-note label').removeClass('active');
        // Remove the id passed to the create / edit note dialog
        $('#modal_create-edit-note').attr('data-id', '');
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
      $('#modal_create-edit-note').attr('data-id', '');
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
      // Set the message of teh note being edited
      $('#textarea__create-edit-note-text').val(message);
      // Tell the edit note text fields that there are text in them
      $('#modal_create-edit-note label').addClass('active');
      // Tell the message textarea to update its sized based on the text contianed
      $('#textarea__create-edit-note-text').trigger('autoresize');
      // Open the edit note modal
      $('#modal_create-edit-note').modal('open');
    });

    // Listen for the user to click the delete note that is currently being view in the view note modal
    $('#button_delete-note-viewing').click(function() {
      // Set a variable with the id passed to the modal
      var id = $('#modal_view-note').attr('data-id');
      // Get the users notes directory in the database
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
        // Get the note with the id passed
        .child(id)
        // Remove the note from the database
        .remove();
      // Remove the note from the users screen
      $('#' + id).parent().remove();
      // Close the view note modal
      $('#modal_view-note').modal('close');
    });

    // Listen for the close button in the new note modal to be used
    $('#button__close-view-note').click(function() {
      // Remove the id passed to the modal
      $('#modal_view-note').attr('data-id', '');
      // Close the modal
      $('#modal_view-note').modal('close');
    });


    /* 
    JQuery Handelers for assignments page
    */
    $('#button__open-assignment-due-date-picker').click(function() {
      setTimeout(function() {
        $('#date__create-edit-assignment-due-date').trigger('click')
      }, 250);
    });
    $('#button__close-create-edit-assignment').click(function() {
      $('#modal__create-edit-assignment').modal('close');
      // Tell the textfields that they no longer have text
      $('#modal__create-edit-assignment label').removeClass('active');
      // Tell the textfields that there is no data to be valid
      $('.create-edit-assignment-field').removeClass('valid');
      $('.create-edit-assignment-field').val('');
      if ($('#modal__create-edit-assignment').attr('data-id').length != 0) {
        $('#modal__create-edit-assignment').attr('data-id', '');
      }
    });
    $('#button__finish-create-edit-assignment').click(function() {
      if (utilCheckFields('create-edit-assignment-required')) {
        var name = $('#text__create-edit-assignment-name').val();
        var assignmentClass = $('#text__create-edit-assignment-class').val() ? $('#text__create-edit-assignment-class').val() : 'No Class';
        var details = $('#text__create-edit-assignment-details').val() ? $('#text__create-edit-assignment-details').val() : 'Not Provided';
        var due = moment($('#date__create-edit-assignment-due-date').val() +
          ' ' + $('#number__assignment-hour-due').val() +
          ':' + $('#number__assignment-minute-due').val() +
          ' ' + $('#select__assignment-am-pm').val(), "D MMMM YYYY hh:mm a").toString();
        if (!$('#modal__create-edit-assignment').attr('data-id')) {
          firebase.database()
            .ref('/users/' + firebase.auth().currentUser.uid + '/assignments/')
            .push({
              name: name,
              class: assignmentClass,
              details: details,
              due: (due == "Invalid date") ? 'No Due Date' : due
            }).then(function() {
              $('#modal__create-edit-assignment').modal('close');
              // Tell the textfields that they no longer have text
              $('#modal__create-edit-assignment label').removeClass('active');
              $('.create-edit-assignment-field').val('');
              // Tell the textfields that there is no data to be valid
              Materialize.updateTextFields();
            }).catch(function(e) {
              FBErrorHandeler(e);
              Materialize.toast('There was a problem creating the assignment!', 5000)
            });
        } else {
          firebase.database()
            .ref('/users/' + firebase.auth().currentUser.uid + '/assignments/')
            .child($('#modal__create-edit-assignment').attr('data-id'))
            .set({
              name: name,
              class: assignmentClass,
              details: details,
              due: (due == "Invalid date") ? 'No Due Date' : due
            });
          $('#modal__create-edit-assignment').modal('close');
          // Tell the textfields that they no longer have text
          $('#modal__create-edit-assignment label').removeClass('active');
          $('.create-edit-assignment-field').val('');
        }
      } else {
        Materialize.toast('Please enter a name!', 5000);
      }
    });

    /*
      All Firebase handelers / initiators are here
    */

    // Initialize the Firebase app script
    firebase.initializeApp(FirebaseConfig);

    firebase.auth().getRedirectResult().then(function(result) {

    }).catch(FBErrorHandeler);
    // Wait for changed in the user authentication and fire on page load
    firebase.auth().onAuthStateChanged(function(user) {
      // There is a user account logged in
      if (user) {
        // There is no user account logged in
        // Show elements with the class auth
        $('.auth').show();
        // Hide elements with the class no-auth
        $('.no-auth').hide();
        // Update the name areas in the ui with the name in the users base
        $('.area__menu-name').text(firebase.auth().currentUser.displayName);
        // Update the email area in the ui with the email in the users base
        $('.area__menu-email').text(firebase.auth().currentUser.email);
        // Get a reference to the user directory
        firebase.database().ref('/users/' + firebase.auth().currentUser.uid)
          // Retive the data once
          .once('value')
          // Handel the data recived
          .then(function(snapshot) {
            // The data had been sucessfully recived
            if (!snapshot.val()) {
              // There is a user directory present
              $('.section__account-setup').fadeIn();
            }
          });

        // Create a switch statement to add different handeling for different pages judging with the page title
        switch ($('.brand-logo').text()) {


          /*
            Handeler for the notes page
          */
          case 'Notes':
            // Create a new note handeler with the Vue library
            var NotesHandeler = new Vue({
              el: '#notes-wrapper', // Tell the handeler what element should be used
              data: { // Create a template data set for the element
                notes: [], // Create a notes data template
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
                  // Get a reference to the users notes directory
                  firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
                    // Get the note
                    .child(id)
                    // Delete / remove the note
                    .remove();
                  // Remove the note from the users screen
                  $('#' + id).parent().remove();
                },
              },
            });
            // Get a reference to the users notes directory
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
              // Listen for a new note to be added / handel the current notes
              .on('child_added', function(snapshot) {
                // A new note has been added
                // Send the notes data to the note handeler
                NotesHandeler.notes.push({
                  id: snapshot.key, // Set the id of the note
                  details: snapshot.val(), // Set the name / message of the note
                });
              });
            // Get a reference to the users notes directory
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
              // Listen for a note to be changed
              .on('child_changed', function(snapshot) {
                // Set a variable to contain the notes id
                var indx;
                var key = snapshot.key;
                NotesHandeler.notes.map(function(obj, index) {
                  if (obj.id == key) {
                    indx = index;
                  }
                });
                NotesHandeler.$set(NotesHandeler.notes[indx], 'details', snapshot.val());
              });
            // Get a reference to the users notes directory
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/notes/')
              // Listen for a note to be removed
              .on('child_removed', function(snapshot) {
                // Set a variable to contain the id of the note
                var id = snapshot.key;
                // Remove the note from the users screen
                $('#' + id).parent().remove();
              });
            break;
          case 'Assignments':
            var AssignmentsHandeler = new Vue({
              el: '#assignments-wrapper', // Tell the handeler what element should be used
              data: { // Create a template data set for the element
                assignment: [], // Create a notes data templates
              },
              methods: {
                viewAssignment: function(id, details) {
                  $("#view-assignment_title").text('Name - ' + details['name']);
                  $('#view-assignment_class').text('Class - ' + details['class']);
                  $('#modal__view-assignment').modal('open');
                  $('#view-assignment_details').text(details['details']);
                  $('#view-assignment_due').text(details['due']);
                },
                deleteAssignment: function(id) {
                  $('#' + id).remove();
                  firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/assignments/').child(id).remove();
                },
                editAssignment: function(id, details) {
                  $('#modal__create-edit-assignment').modal('open');
                  $('#modal__create-edit-assignment').attr('data-id', id);
                  $('#text__create-edit-assignment-name').val(details.name);
                  $('#text__create-edit-assignment-class').val(details.class);
                  $('#text__create-edit-assignment-details').val(details.details)
                  Materialize.updateTextFields();
                },
              },
            });
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/assignments/')
              // Listen for a new note to be added / handel the current notes
              .on('child_added', function(snapshot) {
                // A new note has been added
                // Send the notes data to the note handeler
                AssignmentsHandeler.assignment.push({
                  id: snapshot.key, // Set the id of the note
                  details: snapshot.val(), // Set the name / message of the note
                });
                $('#assignments-wrapper').show();
              });
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/assignments/')
              .on('child_changed', function(snapshot) {
                var key = snapshot.key;
                var indx;
                AssignmentsHandeler.assignment.map(function(obj, index) {
                  if (obj.id == key) {
                    indx = index;
                  }
                });
                AssignmentsHandeler.$set(AssignmentsHandeler.assignment[indx], 'details', snapshot.val());
              });
            break;
          case 'Login':
            window.location.href = window.location.origin + '/' + window.location.pathname.split('/')[1]
            break;
        }
      } else {
        // Hide elements with the auth class
        $('.auth').hide();
        // Show elements with the no-auth class
        $('.no-auth').show();
        $('.button-collapse').sideNav('hide');
      }
    });
  });
}());
