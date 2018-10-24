package com.example.demo.ws;

import java.net.URI;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.Timer;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.DefaultHttpHeaders;
import io.netty.handler.codec.http.HttpClientCodec;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketClientHandshakerFactory;
import io.netty.handler.codec.http.websocketx.WebSocketVersion;
import io.netty.handler.ssl.SslContext;

public class WebSocketBase {
	private Logger log = Logger.getLogger(WebSocketBase.class);
	private String url = null;
	private IWebSocketService service = null;
	private Timer timerTask = null;
	private MoniterTask moniter = null;
	private Channel channel = null;
	private EventLoopGroup group = null;
	private Bootstrap bootstrap = null;
	private ChannelFuture future = null;
	private Set<String> subscribChannel = new HashSet<String>();
	private boolean isAlive = false;

	public WebSocketBase(String url, IWebSocketService serivce) {
		this.url = url;
		this.service = serivce;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public IWebSocketService getService() {
		return service;
	}

	public void setService(IWebSocketService service) {
		this.service = service;
	}

	public void start() {
		moniter = new MoniterTask(this);
		this.connect();
//		timerTask = new Timer();
//		timerTask.schedule(moniter, 1000, 5000);
		
        ScheduledThreadPoolExecutor  scheduled = new ScheduledThreadPoolExecutor(10);
        scheduled.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
            	moniter.run();
            }
        }, 0, 5, TimeUnit.SECONDS);//0表示首次执行任务的延迟时间，40表示每次执行任务的间隔时间，TimeUnit.MILLISECONDS执行的时间间隔数值单位

	}

	private void connect() {
		try {
			final URI uri = new URI(url);

			group = new NioEventLoopGroup(1);
			bootstrap = new Bootstrap();
			final SslContext sslCtx = SslContext.newClientContext();
			final WebSocketClientHandler handler = new WebSocketClientHandler(WebSocketClientHandshakerFactory
					.newHandshaker(uri, WebSocketVersion.V13, null, false, new DefaultHttpHeaders(), Integer.MAX_VALUE), service, moniter,
					this);
			bootstrap.group(group).option(ChannelOption.TCP_NODELAY, true).channel(NioSocketChannel.class)
					.handler(new ChannelInitializer<SocketChannel>() {
						protected void initChannel(SocketChannel ch) {
							ChannelPipeline p = ch.pipeline();
							if (sslCtx != null) {
								p.addLast(sslCtx.newHandler(ch.alloc(), uri.getHost(), uri.getPort()));
							}
							p.addLast(new HttpClientCodec(), new HttpObjectAggregator(8192), handler);
						}
					});

			future = bootstrap.connect(uri.getHost(), 443);
			future.addListener(new ChannelFutureListener() {
				public void operationComplete(final ChannelFuture future) throws Exception {
				}
			});
			channel = future.sync().channel();
			handler.handshakeFuture().sync();
			this.setStatus(true);
		} catch (Exception e) {
			log.info("WebSocketClient start error ", e);
			group.shutdownGracefully();
			this.setStatus(false);
		}
	}

	public void sendMessage(String message) {
		if (!isAlive) {
			log.warn("WebSocket is not Alive addChannel error");
		}else{
			log.debug("send:" + message);
			channel.writeAndFlush(new TextWebSocketFrame(message));
		}
	}

	public void setStatus(boolean flag) {
		this.isAlive = flag;
	}

	public void addSub(String sub, String subId) {
		if (channel == null) {
			return;
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("sub", sub);
		jsonObject.put("id", subId);
		String msg = jsonObject.toJSONString();
		this.sendMessage(msg);
		log.info("新增订阅："+sub);
		subscribChannel.add(msg);
	}

	public void unSub(String sub, String subId) {
		if (channel == null) {
			return;
		}
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("unsub", sub);
		jsonObject.put("id", subId);
		String msg = jsonObject.toJSONString();
		this.sendMessage(msg);
		log.info("删除订阅："+sub);
		Iterator it = subscribChannel.iterator();
		while(it.hasNext()){
			String str = (String) it.next();
			JSONObject json = JSONObject.parseObject(str);
			if(subId.equals(json.get("id"))){
				it.remove();
			}
		}
		
		JSONObject jsonObjectSub = new JSONObject();
		jsonObjectSub.put("sub", sub);
		jsonObjectSub.put("id", subId);
		String submsg = jsonObjectSub.toJSONString();
		subscribChannel.remove(submsg);
	}
	
	public void addChannel(String msg) {
		if (channel == null) {
			return;
		}
		this.sendMessage(msg);
		log.info("新增订阅："+msg);
		subscribChannel.add(msg);
	}

	public void reConnect() {
		try {
			log.info("开始重连！！！");
			service.onReset();
			this.group.shutdownGracefully();
			this.group = null;
			this.connect();
			if (future.isSuccess()) {
				this.setStatus(true);
				Iterator<String> it = subscribChannel.iterator();
				while (it.hasNext()) {
					String msg = it.next();
					this.addChannel(msg);
				}
			}
			log.info("重连完成！！！");
		} catch (Exception e) {
			log.error(e);
			e.printStackTrace();
		}
	}
	
	public void sentPing(long ping) {
		String dataMsg = "{'ping':" + ping + "}";
		this.sendMessage(dataMsg);
	}

	public void sentPong(String pong) {
		String dataMsg = "{\"pong\":" + pong + "}";
		this.sendMessage(dataMsg);
	}
}
