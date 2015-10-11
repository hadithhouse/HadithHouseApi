(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  // TODO: We shouldn't need this any more as we now have a special page for hadith details, so we should use that
  // one and set the status of the hadith to being added, i.e. not yet added to the server.
  function AddHadithDialogCtrl($scope, $mdDialog, PersonsService, TagsService, ToastService, HadithsService) {
    var ctrl = this;

    ctrl.newHadith = {
      text: '',
      personId: null,
      tags: []
    };

    ctrl.isSaveMode = function() {
      return ctrl.locals && ctrl.locals.hadith;
    };

    if (ctrl.isSaveMode()) {
      ctrl.newHadith.id = ctrl.locals.hadith.id;
      ctrl.newHadith.text = ctrl.locals.hadith.text;
      ctrl.newHadith.person = {
        id: ctrl.locals.hadith.person
      };
      ctrl.newHadith.tags = ctrl.locals.hadith.tags.map(function(tagName) {
        return {
          name: tagName
        };
      });
    }

    ctrl.selectedTag = null;
    ctrl.tagQuery = '';

    ctrl.persons = [];
    ctrl.personsLoaded = false;
    PersonsService.getPersons().then(function onSuccess(persons) {
      ctrl.personsLoaded = true;
      ctrl.persons = persons;
    });

    $scope.$watch(function() { return ctrl.personsLoaded; }, function() {
      if (ctrl.isSaveMode()) {
        ctrl.newHadith.person = {
          id: ctrl.locals.hadith.person
        };
      }
    });

    ctrl.findPersons = function (query) {
      if (!ctrl.personsLoaded) {
        return [];
      }

      return ctrl.persons.filter(function (person) {
        return person.title.indexOf(query) > -1 ||
          person.display_name.indexOf(query) > -1 ||
          person.full_name.indexOf(query) > -1 ||
          person.brief_desc.indexOf(query) > -1;
      });
    };

    ctrl.tags = [];
    ctrl.tagsLoaded = false;
    TagsService.getTags().then(function onSuccess(tags) {
      ctrl.tagsLoaded = true;
      ctrl.tags = tags;
    });

    ctrl.findTags = function (query) {
      if (!ctrl.tagsLoaded) {
        return [];
      }

      return ctrl.tags.filter(function (tag) {
        return tag.name.indexOf(query) > -1;
      });
    };

    ctrl.cancel = function () {
      $mdDialog.cancel();
    };

    ctrl.add = function () {
      var newHadith = {
        id: ctrl.newHadith.id,
        text: ctrl.newHadith.text,
        tags: ctrl.newHadith.tags.map(function (tag) {
          return tag.name;
        }),
        person: ctrl.newHadith.person.id
      };
      if (ctrl.isSaveMode()) {
        TagsService.putHadith(newHadith).then(function onSuccess() {
          ToastService.show('Hadith saved');
          $mdDialog.hide(newHadith);
        }, function onError() {
          ToastService.show("Couldn't save hadith! Please try again.");
        });
      } else {
        HadithsService.postHadith(newHadith).then(function onSuccess() {
          ToastService.show('Hadith added');
          $mdDialog.hide(newHadith);
        }, function onError() {
          ToastService.show("Couldn't add hadith! Please try again.");
        });
      }
    };
  }

  HadithHouseApp.controller('AddHadithDialogCtrl', AddHadithDialogCtrl);
}());
