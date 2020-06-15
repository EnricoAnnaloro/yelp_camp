alert("popup");

$('#exampleModalCenter').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var comment_id = button.data('comment_id') // Extract info from data-* attributes
    console.log(typeof(comment_id.toObjectId));
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + comment_id)
    modal.find('#commentText').val()
})