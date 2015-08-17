(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  function AddHadithDialogCtrl($scope, $mdDialog, PersonsService, TagsService, HadithsService) {
    var ctrl = this;

    ctrl.newHadith = {
      text: '',
      personId: null,
      tags: []
    };

    ctrl.selectedTag = null;
    ctrl.tagQuery = '';

    ctrl.persons = [];
    ctrl.personsLoaded = false;
    PersonsService.getPersons().then(function onSuccess(persons) {
      ctrl.personsLoaded = true;
      ctrl.persons = persons;
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
        text: ctrl.newHadith.text,
        tags: ctrl.newHadith.tags.map(function (tag) {
          return tag.name;
        }),
        person: ctrl.newHadith.person.id
      };
      HadithsService.postHadith(newHadith);

      $mdDialog.hide(newHadith);
    };
  }

  HadithHouseApp.controller('AddHadithDialogCtrl', AddHadithDialogCtrl);
}());
