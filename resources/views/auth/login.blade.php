<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sistema de inicio APP</title>

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">

<link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">

<link rel="stylesheet" href="plugins/icheck-bootstrap/icheck-bootstrap.min.css">

<link rel="stylesheet" href="dist/css/adminlte.min.css?v=3.2.0">
<script nonce="6c397771-1ca4-4403-a470-79b3a64f691f">try{(function(w,d){!function(c,d,e,f){if(c.zaraz)console.error("zaraz is loaded twice");else{c[e]=c[e]||{};c[e].executed=[];c.zaraz={deferred:[],listeners:[]};c.zaraz._v="5714";c.zaraz.q=[];c.zaraz._f=function(g){return async function(){var h=Array.prototype.slice.call(arguments);c.zaraz.q.push({m:g,a:h})}};for(const i of["track","set","debug"])c.zaraz[i]=c.zaraz._f(i);c.zaraz.init=()=>{var j=d.getElementsByTagName(f)[0],k=d.createElement(f),l=d.getElementsByTagName("title")[0];l&&(c[e].t=d.getElementsByTagName("title")[0].text);c[e].x=Math.random();c[e].w=c.screen.width;c[e].h=c.screen.height;c[e].j=c.innerHeight;c[e].e=c.innerWidth;c[e].l=c.location.href;c[e].r=d.referrer;c[e].k=c.screen.colorDepth;c[e].n=d.characterSet;c[e].o=(new Date).getTimezoneOffset();if(c.dataLayer)for(const p of Object.entries(Object.entries(dataLayer).reduce(((q,r)=>({...q[1],...r[1]})),{})))zaraz.set(p[0],p[1],{scope:"page"});c[e].q=[];for(;c.zaraz.q.length;){const s=c.zaraz.q.shift();c[e].q.push(s)}k.defer=!0;for(const t of[localStorage,sessionStorage])Object.keys(t||{}).filter((v=>v.startsWith("_zaraz_"))).forEach((u=>{try{c[e]["z_"+u.slice(7)]=JSON.parse(t.getItem(u))}catch{c[e]["z_"+u.slice(7)]=t.getItem(u)}}));k.referrerPolicy="origin";k.src="/cdn-cgi/zaraz/s.js?z="+btoa(encodeURIComponent(JSON.stringify(c[e])));j.parentNode.insertBefore(k,j)};["complete","interactive"].includes(d.readyState)?zaraz.init():c.addEventListener("DOMContentLoaded",zaraz.init)}}(w,d,"zarazData","script");})(window,document)}catch(e){throw fetch("/cdn-cgi/zaraz/t"),e;};</script></head>
<body class="hold-transition login-page" style="background-image: url('{{ url('assets/img/fondo_tres.jpg') }}');
    background-repeate: no-repeat;
    background-size: 100vw 100vh">
<div class="login-box">

<div class="card card-outline card-primary">
    <div class="card-header text-center">
        <a href="#" class="h1"><b>All 369</a>
</div>
    <div class="card-body">
        <p class="login-box-msg">Iniciar sesión</p>

<form method="POST" action="{{ route('login') }}">
                        @csrf

                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="email" class="col-form-label text-md-end">Correo electrónico</label>

                                    <div class="">
                                        <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                        @error('email')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="password" class="col-form-label text-md-end">Contraseña</label>

                                    <div class="">
                                        <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                        @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-primary btn-block">
                                    {{ __('Login') }}
                                </button>
                            </div>
                        </div>
                    </form>
<br>
                    <p class="mb-0">
                        <a href="{{ url('register') }}" class="text-center"></a>
                    </p>
                </div>

                </div>

                </div>


<script src="plugins/jquery/jquery.min.js"></script>

<script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>

<script src="dist/js/adminlte.min.js?v=3.2.0"></script>
</body>
</html>
