#! /bin/sh
ip address show | awk  -v var='base' '{
if(match($1, /[[:digit:]]+:/)>0){
    split($1,a,":");
    base[1] = a[1];
    split($2,b,":");
    base[2] = b[1];
    base[3] = $5;
}
if($1=="inet"){
    printf base[1] " " base[2] " " base[3] " ";
    split($2,c,"/");
    printf c[1] " /" c[2] " ";
    if($3=="brd"){
        printf "true";
    }else{
        printf "false";
    }
    print "";
}
}'