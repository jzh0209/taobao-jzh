require(['./js/config.js'], function() {
    require(['jquery', 'bscroll'], function($, bscroll) {
        var scroll = new bscroll('.list-wrap', {
            probeType: 2,
            click: true
        })

        var pagenum = 1,
            limit = 15,
            total = 0,
            type = '',
            key = '';

        var List = $('.inner-list');
        scroll.on('scroll', function() {
            if (this.y < this.maxScrollY - 44) {
                if (pagenum < total) {
                    List.attr('up', '释放加载更多')
                } else {
                    List.attr('up', '没有更多数据')
                }
            } else if (this.y < this.maxScrollY - 22) {
                if (pagenum < total) {
                    List.attr('up', '上拉加载')
                } else {
                    List.attr('up', '没有更多数据')
                }
            }
        })

        scroll.on('touchEnd', function() {
            if (List.attr('up') === '释放加载更多') {
                if (pagenum < total) {
                    pagenum++;
                    getData(type, key);
                } else {
                    List.attr('up', '没有数据');
                }
            }
        })

        function getData(type, key) {
            type = type || '';
            key = key || '';
            $.ajax({
                url: '/api/list',
                dataType: 'json',
                data: {
                    pagenum: pagenum,
                    limit: limit, //每页显示多少条
                    type: type,
                    key: key
                },
                success: function(res) {
                    console.log(res)
                    if (res.code === 1) {
                        total = res.total;
                        render(res.data);
                    }
                }
            })
        }

        function render(data) {
            var str = '';
            data.forEach(function(item) {
                str += `<li>销量:${item.sale}</li>`;
            })
            List.append(str);
            scroll.refresh();
        }

        function addEvent() {
            $('.sale-btn').on('click', function() {
                List.html('');
                pagenum = 1;
                type = 'sale';
                getData(type, key);
            })
        }


        function init() {
            getData(type, key);
            addEvent();
        }

        init();
    })
})