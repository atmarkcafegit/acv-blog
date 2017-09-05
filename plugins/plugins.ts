import Vue from 'vue'
import VeeValidate from 'vee-validate';
import * as moment from 'moment';

Vue.use(VeeValidate);

Vue.filter('shortDescription', function(value, max, cont) {
    if (value.length > max) {
        return value.substring(0, max) + ((cont) ? '...' : '')
    }

    return value;
});

Vue.filter('dateFormat', function(value) {
    return moment(value).format('MMMM Do YYYY');
});

Vue.filter('countData', function(value) {
    return value.length;
});



