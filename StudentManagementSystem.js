$(document).ready(function() {
    const homeForm = $('#homeclass');
    const addStudentForm = $('#add-class');
    const checklistStudentForm = $('#studentlist');
    const studentTableBody = $('#studentTable tbody');

    let students = []; // Array to hold student data
    let editingStudentId = null; // To keep track of which student is being edited

    // Handle "Check List" button on home screen
    $('button[name="btnCheckList"]').on('click', function(event) {
        event.preventDefault();
        homeForm.fadeOut(300, function() {
            checklistStudentForm.fadeIn(300);
            fetchStudents(); // Fetch students when switching to the list view
        });
    });

    // Handle "Add Student" button on home screen
    $('button[name="addListStudent"]').on('click', function(event) {
        event.preventDefault();
        homeForm.fadeOut(300, function() {
            addStudentForm.fadeIn(300);
            $('#addStudentForm')[0].reset(); // Reset the form when switching to Add Student
            editingStudentId = null; // Clear editing student ID
        });
    });

    // Handle "Check List" button in the Add Student form
    $('#checklist').on('click', function(event) {
        event.preventDefault();
        addStudentForm.fadeOut(300, function() {
            checklistStudentForm.fadeIn(300);
            fetchStudents(); // Fetch students when switching to the list view
        });
    });

    // Handle "Add Student" button in the Student List section
    $('#addbutton').on('click', function(event) {
        event.preventDefault();
        checklistStudentForm.fadeOut(300, function() {
            addStudentForm.fadeIn(300);
            $('#addStudentForm')[0].reset(); // Reset the form when switching to Add Student
            editingStudentId = null; // Clear editing student ID
        });
    });

    // Handle "Back to Home" button
    $('.back-home-btn').on('click', function(event) {
        event.preventDefault();
        addStudentForm.add(checklistStudentForm).fadeOut(300, function() {
            homeForm.fadeIn(300);
        });
    });

    // Handle Add or Update Student Form Submission
    $('#submitStudentButton').on('click', function(event) {
        event.preventDefault();
        const studentData = {
            id: editingStudentId || (students.length + 1), // Use existing ID for updates or new ID for new student
            name: $('#studentName').val(),
            email: $('#studentEmail').val(),
            age: $('#studentAge').val(),
            class: $('#studentClass').val()
        };

        // Perform simple validation
        if (!studentData.name || !studentData.email || !studentData.age || !studentData.class) {
            // Optionally display a message to fill all fields
            return;
        }

        const url = editingStudentId ? 'update_student.php' : 'add_student.php';

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(studentData),
            success: function(response) {
                const result = JSON.parse(response);
                if (result.status === 'success') {
                    $('#addStudentForm')[0].reset(); // Reset the form
                    addStudentForm.fadeOut(300, function() {
                        checklistStudentForm.fadeIn(300);
                        fetchStudents(); // Refresh student list
                    });
                }
                // Optionally log errors or handle them internally
            },
            error: function() {
                // Handle errors internally, or log them for debugging purposes
            }
        });
    });

    // Fetch and display students
    function fetchStudents() {
        $.get('fetch_students.php', function(data) {
            students = JSON.parse(data);
            updateStudentTable(students);
        }).fail(function() {
            // Handle fetch error internally or log for debugging
        });
    }

    // Update student table with fetched data
    function updateStudentTable(students) {
        studentTableBody.empty(); // Clear existing rows

        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.age}</td>
                    <td>${student.class}</td>
                    <td>
                        <button type="button" class="action-btn update-btn" data-id="${student.id}">Update</button>
                        <button type="button" class="action-btn delete-btn" data-id="${student.id}">Delete</button>
                    </td>
                </tr>
            `;
            studentTableBody.append(row);
        });

        // Attach event handlers for update and delete buttons
        $('.update-btn').on('click', function() {
            const id = $(this).data('id');
            const student = students.find(student => student.id == id); // Use == for type conversion

            // Pre-fill the form with student data for editing
            if (student) {
                $('#studentName').val(student.name);
                $('#studentEmail').val(student.email);
                $('#studentAge').val(student.age);
                $('#studentClass').val(student.class);

                // Set the editing student ID
                editingStudentId = student.id;

                // Show the Add Student form
                addStudentForm.fadeIn(300);
                checklistStudentForm.fadeOut(300);
            }
        });

        $('.delete-btn').on('click', function() {
            const id = $(this).data('id');
            if (confirm(`Are you sure you want to delete student with ID: ${id}?`)) {
                $.get(`delete_student.php?id=${id}`, function(response) {
                    const result = JSON.parse(response);
                    if (result.status === 'success') {
                        fetchStudents(); // Refresh student list
                    }
                    // Optionally log errors or handle them internally
                }).fail(function() {
                    // Handle deletion error internally or log for debugging
                });
            }
        });
    }
});
