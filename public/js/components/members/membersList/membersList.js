((app) => {
    app.component('membersList', {
            templateUrl: 'js/components/members/membersList/membersList.html',

            controller: function(contactsService) {
                  contactsService.get().then((response) => {
                        this.contacts = response.data
                    });

                    /*  ======================================
                          Add, Date & Load More Functions
                      ====================================== */


                    this.add = (contact) => {
                        this.contacts.push(this.contacts),
                            console.log('this has been added');
                    };


                    let date = new Date();
                    this.hhmm = (new Date(), 'hh:mm');


                    this.carouselstate = 6
                    this.loadMore = () => {
                        this.carouselstate += 6
                    };

              } //dont delete
        }); //dont delete
})(require('angular').module('app.member'))


                    /*this.carouselstate = 0

                      this.next = () => {
                          this.carouselstate ==
                              this.members.length - 1 ?
                              this.carouselstate = 0 :
                              this.carouselstate++
                              console.log('search next members');
                      }

                      this.prev = () => {
                          this.carouselstate < 1 ?
                              this.carouselstate =
                              this.members.length - 1 :
                              this.carouselstate--;
                          console.log('search prev member');
                      }*/
