(function() {
  var TodoController, TodoFrameView, TodoItem, TodoItemCollection, TodoItemView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.autoUpate = true;
  TodoItem = (function() {
    __extends(TodoItem, Backbone.Model);
    TodoItem.prototype.url = function() {
      return 'http://127.0.0.1:5984/todos/' + this.id;
    };
    function TodoItem(options) {
      TodoItem.__super__.constructor.call(this, options);
      this.selfUpdate();
    }
    TodoItem.prototype.selfUpdate = function() {
      if (window.autoUpate) {
        this.fetch();
      }
      return _.delay(_.bind(this.selfUpdate, this), 1000);
    };
    TodoItem.prototype.set = function(attrs, options) {
      if (attrs.ok) {
        return TodoItem.__super__.set.call(this, {
          _rev: attrs.rev
        });
      }
      return TodoItem.__super__.set.call(this, attrs, options);
    };
    TodoItem.prototype.destroy = function(options) {
      this.url = this.url() + '?rev=' + this.get('_rev');
      return TodoItem.__super__.destroy.call(this, options);
    };
    return TodoItem;
  })();
  TodoItemCollection = (function() {
    __extends(TodoItemCollection, Backbone.Collection);
    function TodoItemCollection() {
      TodoItemCollection.__super__.constructor.apply(this, arguments);
    }
    TodoItemCollection.prototype.model = TodoItem;
    TodoItemCollection.prototype.url = 'http://127.0.0.1:5984/todos/_all_docs/';
    TodoItemCollection.prototype.parse = function(response) {
      return response.rows;
    };
    return TodoItemCollection;
  })();
  TodoItemView = (function() {
    __extends(TodoItemView, Backbone.View);
    function TodoItemView(options) {
      var el;
      TodoItemView.__super__.constructor.call(this, options);
      this.el = el = $("<li></li>");
      this.model.bind("change", _.bind(this.render, this));
      this.el.click(function() {
        return el.attr('contentEditable', 'true').addClass("editing");
      });
      this.el.blur(__bind(function() {
        el.attr('contentEditable', '').removeClass("editing");
        if (this.model.get('content') !== el.html()) {
          if (el.text().trim() === '') {
            this.removed = true;
            return this.model.destroy();
          } else {
            return this.model.save({
              content: el.html()
            });
          }
        }
      }, this));
    }
    TodoItemView.prototype.render = function() {
      var content;
      if (this.removed) {
        return;
      }
      content = this.model.get('content');
      return this.el.html(content);
    };
    return TodoItemView;
  })();
  TodoFrameView = (function() {
    __extends(TodoFrameView, Backbone.View);
    function TodoFrameView(options) {
      TodoFrameView.__super__.constructor.call(this, options);
      this.subviews = [];
      if ((options != null ? options.subviews : void 0) != null) {
        this.subviews = options.subviews.slice(0);
      }
    }
    TodoFrameView.prototype.add = function(subview) {
      return this.subviews.push(subview);
    };
    TodoFrameView.prototype.addAndRender = function(subview) {
      this.subviews.push(subview);
      subview.render();
      this.el.append(subview.el);
      return subview.el.hide().fadeIn('slow');
    };
    TodoFrameView.prototype.render = function() {
      var el;
      this.subviews = _(this.subviews).reject(function(entry) {
        return entry.removed;
      });
      el = this.el;
      el.empty();
      return _(this.subviews).each(function(subview) {
        subview.render();
        return el.append(subview.el);
      });
    };
    return TodoFrameView;
  })();
  TodoController = (function() {
    __extends(TodoController, Backbone.Controller);
    function TodoController() {
      var collection, self;
      self = this;
      collection = new TodoItemCollection;
      collection.fetch({
        error: function() {
          return alert("Cannot load data!");
        },
        success: function() {
          var frame, model, models, views;
          models = _(collection.models).reject(function(x) {
            return x.id[0] === '_';
          });
          collection.refresh(models);
          views = (function() {
            var _i, _len, _ref, _results;
            _ref = collection.models;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              model.fetch();
              _results.push(new TodoItemView({
                model: model
              }));
            }
            return _results;
          })();
          self.frame = frame = new TodoFrameView({
            subviews: views,
            el: $("#todos")
          });
          frame.render();
          return collection.bind('remove', _.bind(self.frame.render, self.frame));
        }
      });
      $("#newitembtn").click(function() {
        $(this).hide();
        return $(this).prev().show();
      });
      $("#yes").click(function() {
        var newModel;
        newModel = collection.create({
          content: $("#newitem input").val(),
          id: window.uuids.shift()
        });
        return self.frame.addAndRender(new TodoItemView({
          model: newModel
        }));
      });
      $("#yes, #no").click(function() {
        return $(this).parent().hide().next().show();
      });
    }
    return TodoController;
  })();
  $(document).ready(function() {
    $.getJSON("http://127.0.0.1:5984/_uuids?count=100", function(data) {
      return window.uuids = data.uuids;
    });
    return new TodoController;
  });
}).call(this);
