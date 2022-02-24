//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowed;
    uint256 private _totalSupply;
    address private _owner;
    string public _name;
    string public _symbol;
    uint256 public _decimals;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed from, address indexed to, uint256 amount);

    modifier notZeroAddress(address addr) {
        require(addr != address(0), "Zero address");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "You are not owner");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    // View functions
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    function allowance(address owner, address spender)
        public
        view
        returns (uint256)
    {
        return _allowed[owner][spender];
    }

    function transfer(address to, uint256 amount)
        public
        notZeroAddress(to)
        returns (bool)
    {
        require(amount <= _balances[msg.sender], "Not enough tokens");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public notZeroAddress(to) returns (bool) {
        require(amount <= _balances[from], "Not enough tokens");
        require(
            amount <= _allowed[from][msg.sender],
            "Cannot transfer such tokens amount or you cannot spend tokens of this owner"
        );

        _balances[from] -= amount;
        _balances[to] += amount;
        _allowed[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount)
        public
        notZeroAddress(spender)
        returns (bool)
    {
        _allowed[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue)
        public
        notZeroAddress(spender)
        returns (bool)
    {
        _allowed[msg.sender][spender] += addedValue;
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtracredValue)
        public
        notZeroAddress(spender)
        returns (bool)
    {
        require(
            subtracredValue <= _allowed[msg.sender][spender],
            "Allowed value to spend less then 0"
        );

        _allowed[msg.sender][spender] -= subtracredValue;
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    function mint(address owner, uint256 amount)
        public
        onlyOwner
        notZeroAddress(owner)
    {
        _balances[owner] += amount;
        _totalSupply += amount;

        emit Transfer(address(0), owner, amount);
    }

    function burn(address owner, uint256 amount)
        public
        onlyOwner
        notZeroAddress(owner)
    {
        require(
            amount <= _balances[owner],
            "There is no such amount of tokens"
        );

        _balances[owner] -= amount;
        _totalSupply -= amount;

        emit Transfer(owner, address(0), amount);
    }
}
