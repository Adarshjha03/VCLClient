// 2024-05-07 13:08:10
// GUNJAN AGRWAL
// Linkedin: https://www.linkedin.com/in/gunjan-agrawal-537929229/
// Codeforces: https://codeforces.com/profile/Doby_Deol
// Codechef: https://www.codechef.com/users/gunjan192002

#include <bits/stdc++.h>
//#include <iostream>
//#include <map>
//#include <unordered_map>
//#include <math.h>
//#include <vector>
//#include <utility>
#include <set>
using namespace std;

//Speed
#define fastio() ios_base::sync_with_stdio(false), cin.tie(nullptr), cout.tie(nullptr);

//Macros
#define IOtext freopen("input.txt","r",stdin); freopen("output.txt","w",stdout);
#define PI (3.141592653589)
#define M 1000000007
#define pb push_back
#define f first
// #define s second
#define foreach(i, j, k, in) for(int i=j;i<k;i+=in)
#define rforeach(i, j, k, in) for(int i=j;i>=k;i-=in)
#define rep(i,j) foreach(i,0,j,1)
#define rrep(i,j) rforeach(i,j,0,1)
#define set_bits(x) __builtin_popcountll(x)
#define zero_bits(x) __builtin_ctzll(x)
#define sz(s) (int)(s.size())
#define Num_of_Digits(n) ((int)log10(n) + 1)
#define inint(x) int x; cin>>x;
#define inll(x) long long int x; cin>>x;
#define instr(x) string x; cin>>x;
#define all(x) x.begin(), x.end()
//#define os(x) cout << x << " ";
//#define out(x) cout << x << endl;
#define MAX(x) *max_element(all(x))
#define MIN(x) *min_element(all(x))
#define SUM(x) accumulate(all(x), 0LL)
#define COUNT(x,u) count(all(x), u)
#define B break
#define C continue
//#define py cout<<"YES"<<endl
//#define pn cout<<"NO"<<endl
//#define pm cout<<"-1"<<endl
//#define ps(x,y) fixed<<setprecision(y)<<x

//Typedef
typedef long long ll;
typedef unsigned long long ull;
typedef long double lld;
typedef pair<int, int> pi;
typedef pair<ll, ll> pl;
typedef vector<int> vi;
typedef vector<ll> vl;
typedef vector<pi> vpi;
typedef vector<pl> vpl;
typedef vector<vi> vvi;
typedef vector<vl> vvl;
typedef map<int,int> mii;
typedef set<int> st;

//Check
bool isPrime(ll n){if(n<=1)return false;if(n<=3)return true;if(n%2==0||n%3==0)return false;for(int i=5;i*i<=n;i=i+6)if(n%i==0||n%(i+2)==0)return false;return true;}
bool isPowerOfTwo(int n){if(n==0)return false;return (ceil(log2(n)) == floor(log2(n)));}
bool isPerfectSquare(ll x){if (x >= 0) {ll sr = sqrt(x);return (sr * sr == x);}return false;}

// Mathematical functions
//void Sieve(int n){ is_prime.assign(n + 1, true); is_prime[0] = is_prime[1] = false; for(ll i = 2; i * i <= n; i++) if(is_prime[i]) for(ll j = i * i; j <= n; j += i) is_prime[j] = false;}
//void get_primes(int n){ for(int i = 2; i <= n; i++)  if(is_prime[i])  primes.push_back(i); }
ll mod_add(ll a, ll b, ll m) {a = a % m; b = b % m; return (((a + b) % m) + m) % m;}
ll mod_sub(ll a, ll b, ll m) {a = a % m; b = b % m; return (((a - b) % m) + m) % m;}
ll gcd(ll a, ll b){if (b == 0)return a;return gcd(b, a % b);} //__gcd 
ll lcm(ll a, ll b){return (a/gcd(a,b)*b);}
ll moduloMultiplication(ll a,ll b,ll mod){ll res = 0;a %= mod;while (b){if (b & 1)res = (res + a) % mod;b >>= 1;}return res;}
ll powermod(ll x, ll y, ll p){ll res = 1;x = x % p;if (x == 0) return 0;while (y > 0){if (y & 1)res = (res*x) % p;y = y>>1;x = (x*x) % p;}return res;}
ll modinv(ll p,ll q){ll ex;ex=M-2;while (ex) {if (ex & 1) {p = (p * q) % M;}q = (q * q) % M;ex>>= 1;}return p;}

ll fun( vector<ll> &p, vector<ll> &a,ll s , ll k)
{
    int n=p.size();
    vector<bool>vis(n);
    ll mx=0,cur=0;
    while((!vis[s])&&k>0)
    {
        vis[s]=1;
        

        mx=max(mx,cur+1ll*k*a[s]);
        cur+=a[s];
        --k;
        s=p[s];
        
    }
    return mx;
}
void solve()
{
   ll n,k,p1,p2;
    cin>>n>>k>>p1>>p2;
    vector<ll> p(n),a(n);
    for(auto &e:p)
    {
        cin>>e;
       e--;
    }
    for(auto &e:a)
    {
        cin>>e;
       e--;
    }
    
    ll A=fun(p,a,p1-1,k),Bi=fun(p,a,p2-1,k);
    
    if(A>Bi){cout<<"Bodya"<<endl;}
      if(A<Bi){cout<<"Sasha"<<endl;}
    if(A==Bi){cout<<"Draw"<<endl;}
   
}


int32_t main()
{
    fastio()
    #ifndef ONLINE_JUDGE
        freopen("Error.txt","w",stderr);
    #endif
    //hello baccho ,code krlo
    int t;
    cin>>t;
    while(t--)
    {
    solve();
    }
    return 0;
}