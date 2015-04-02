angular.module("Lib.SocketManager", [])
  .factory("SocketManager", [->
    class SocketManager

      constructor: (@eventDispatcher)->

        # 实例化 新socket
      instanceSocket: (path, isConnect, onopen, onmessage, onclose)->
        self = this
        socket = new SockJS path
        self.connect socket, onopen, onmessage, onclose if isConnect
        return socket

      # 建立socket连接
      connect: (socket, onopen, onmessage, onclose)->
        self = this
        socket.onopen     = if onopen then onopen else self.onopen
        socket.onmessage  = if onmessage then onmessage else self.onmessage
        socket.onclose    = if onclose then onclose else self.onclose

      onopen: ->
        console.log "a new socket connect"

      # msg.data 结构定义{type: 类型, datas: 数据集合}
      onmessage: (event)->
        console.log "socket deal with event: #{event}"

      onclose: ->
        console.log "socket disconnect"

  ])