((app) => {
    'use strict'
    app.component('login', {
        templateUrl: 'js/components/login/login.html',
        controller: ['usersService', '$state', function(usersService, $state) {
            angular.extend(this, {
                $onInit() {

                    this.form = true

                    // usersService.getCurrent().then((res) => {
                    //     $state.go('app.home')
                    // }).catch(() => {
                    //     $state.go('login')
                    // })

                },
                connect(user) {
                    usersService.connect(user).then((user) => {
                        this.currentUser = user
                        $state.go('app.home')
                      }).catch((err) => {
                        let textContent = `Error : ${err.data} !`
                    })
                },
                newPassword(email) {
                    this.email = false
                    usersService.getOne(email).then((res) => {
                        this.sent = true
                    })
                }
            })
        }]
    })
})(angular.module('app.login'))
