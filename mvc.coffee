# The MVC layer based on backbone

## global stuff
window.autoUpate = yes

## M

class TodoItem extends Backbone.Model
    url: ->
        'http://127.0.0.1:5984/todos/' + this.id
    
    constructor: (options) ->
        super options
        # set up polling
        this.selfUpdate()

    selfUpdate: ->
        if window.autoUpate
            this.fetch()
        _.delay _.bind(this.selfUpdate, this), 1000

    set: (attrs, options) ->
        # couch's non-GET response is not attributes to be set on object
        if attrs.ok
            return super {_rev: attrs.rev}
        super attrs, options

    destroy: (options) ->
        # fix URL for deletion for couch
        this.url = this.url() + '?rev=' + this.get('_rev')
        super options



class TodoItemCollection extends Backbone.Collection
    model: TodoItem
    url: 'http://127.0.0.1:5984/todos/_all_docs/'
    # the response of this URL is not an array by itself. need parsing
    parse: (response) ->
        return response.rows

## V

class TodoItemView extends Backbone.View
    constructor: (options) ->
        super options
        this.el = el = $("<li></li>")
        this.model.bind "change", _.bind(this.render, this)

        # handling DOM event
        this.el.click ->
            el.attr('contentEditable', 'true').addClass("editing")

        this.el.blur =>
            el.attr('contentEditable', '').removeClass("editing")
            if this.model.get('content') isnt el.html()
                if el.text().trim() is ''
                    this.removed = yes
                    this.model.destroy()
                else
                    this.model.save {content: el.html()}

    render: ->
        if this.removed
            return
        content = this.model.get('content')
        this.el.html content


class TodoFrameView extends Backbone.View
    constructor: (options) ->
        super options
        this.subviews = []
        if options?.subviews?
            this.subviews = options.subviews.slice(0)

    add: (subview) ->
        this.subviews.push(subview)

    addAndRender: (subview) ->
        this.subviews.push(subview)
        subview.render()
        this.el.append(subview.el)
        subview.el.hide().fadeIn('slow')

    render: ->
        this.subviews = _(this.subviews).reject (entry) -> entry.removed
        el = this.el
        el.empty()
        _(this.subviews).each (subview) ->
            subview.render()
            el.append(subview.el)


## C

class TodoController extends Backbone.Controller
    constructor: ->
        self = this
        collection = new TodoItemCollection
        collection.fetch
            error: ->
                alert "Cannot load data!"
            success: ->
                views = for model in collection.models
                    model.fetch()
                    new TodoItemView
                        model: model
                self.frame = frame = new TodoFrameView
                    subviews: views
                    el: $("#todos")
                frame.render()
                # when a model is removed from the collection, redraw the frame
                collection.bind 'remove', _.bind(self.frame.render, self.frame)

        # button
        $("#newitembtn").click ->
            $(this).hide()
            $(this).prev().show()
        $("#yes").click ->
            newModel = collection.create
                content: $("#newitem input").val()
                id: window.uuids.shift()
            self.frame.addAndRender new TodoItemView
                model: newModel
            
        $("#yes, #no").click ->
            $(this).parent().hide().next().show()
            


## kickstart

$(document).ready ->
    # prepare some uuids
    $.getJSON "http://127.0.0.1:5984/_uuids?count=100", (data) ->
        window.uuids = data.uuids
    new TodoController
