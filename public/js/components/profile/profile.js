((app) => {
    app.component('profile', {
        templateUrl: 'js/components/profile/profile.html',
        controller: ['$stateParams', 'usersService', 'companiesService', '$state',function($stateParams, usersService, companiesService, $state) {
            angular.extend(this, {
                $onInit() {


                      $(document).ready(function() {
                          $('select').material_select();
                      });
                    
                    this.showHints = true;

                    this.regions = ('Auvergne-Rhône-Alpes Bourgogne-Franche-Comté Bretagne Centre-Val-de-Loire Corse Grand-Est ' +
                        'Hauts-de-France Île-de-France Normandie Nouvelle-Aquitaine Occitanie Pays-de-la-Loire Provence-Alpes-Côte-d\'Azur ' +
                        'Guadeloupe Martinique Guyane La-Réunion Mayotte').split(' ').map(function(state) {
                        return {
                            abbrev: state
                        };
                    });

                    usersService.getCurrent().then((res) => {
                        this.currentUser = res
                        companiesService.getById(this.currentUser.company).then((res) => {
                            this.company = res.data
                        })
                    })


                },
                edit(user) {
                    usersService.edit(user).then((res) => {
                        this.currentUser = res.config.data
                        $state.reload()
                    })
                }
            })
        }]
    });
})(angular.module('app.profile'))
