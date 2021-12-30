//#include <stdio.h>
#include <stdlib.h>
//#include <string.h>
#include <emscripten/emscripten.h>

char* flagzadas= "get the real flag from the bot";
char* password = "Santa<3WASM\0";
int main() {
    //printf("Hello World\n");
}

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE void SetTheFlag(char* arg1) {
    
  int i=0;
  while (arg1[i]!='\0'){
    i++;      
  }
  
  flagzadas = (char *) malloc(i+1);
  
  i=0;
  
  while (arg1[i]!='\0'){
    flagzadas[i]=arg1[i];
    i++;      
  }
  arg1[i]='\0';
}
  
EMSCRIPTEN_KEEPALIVE char* GetTheFlag(char* arg1) {
    char*a;
    char*b;
    a = (char *) malloc(4);
    b = (char *) malloc(4);
    
    int i=0;
    //copy from arg1 to a
    while (arg1[i]!='\0'){
      a[i]=arg1[i];
      i++;      
    }
    
    i=0;//reset i
    int suc=0; //default value false
    //compare if password == b
    while(password[i]!='\0' ){// && b[i]!='\0'
      if (b[i]!=password[i]){suc=0;break;}
      else{suc=1;}
      i++;
    }
    
    if (suc){ //if password == b you win
      return flagzadas;
    }
    else{
      return "Try again";
    }
}

#ifdef __cplusplus
}
#endif



/*
var result = Module.ccall(
            'GetTheFlag',	// name of C function
            'string',	// return type
            ['string'],	// argument types
            ["AAAABBBBCCCCDDDDSanta<3Wasm"]	// ["AAAABBBBCCCCDDDDSanta<3WASM"]	// arguments
        );
        console.log(result);
        
        
var result = Module.ccall(
            'SetTheFlag',	// name of C function
            null,	// return type
            ['string'],	// argument types
            ["SuperFlagzadasDoZezadas"]	// ["AAAABBBBCCCCDDDDSanta<3Wasm"]	// arguments
        );
        console.log(result);        
        


/usr/lib/emscripten/emcc -o WASMFlag.html hello3.c -O0 -s WASM=1 --shell-file html_template/shell_minimal.html -s NO_EXIT_RUNTIME=1  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"


*/
