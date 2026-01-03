#!/bin/bash

# Genuary 2026 Harness
# Usage: ./harness.sh <command> [args]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROMPTS_FILE="$SCRIPT_DIR/prompts.json"
TEMPLATE_DIR="$SCRIPT_DIR/template"
DAYS_DIR="$SCRIPT_DIR/days"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get today's day number (1-31)
get_today() {
  date +%-d
}

# Get current month
get_month() {
  date +%-m
}

# Pad day number to 2 digits
pad_day() {
  printf "%02d" "$1"
}

# Get prompt info for a day
get_prompt() {
  local day=$1
  
  if [[ "$day" == "today" ]]; then
    local month=$(get_month)
    if [[ "$month" != "1" ]]; then
      echo -e "${YELLOW}Warning: It's not January! Showing day 1 as default.${NC}"
      day=1
    else
      day=$(get_today)
    fi
  fi
  
  # Validate day
  if [[ ! "$day" =~ ^[0-9]+$ ]] || [[ "$day" -lt 1 ]] || [[ "$day" -gt 31 ]]; then
    echo -e "${RED}Error: Day must be between 1 and 31${NC}"
    return 1
  fi
  
  # Parse JSON with basic tools (no jq needed)
  local title=$(grep -A3 "\"$day\":" "$PROMPTS_FILE" | grep '"title"' | sed 's/.*: "\(.*\)".*/\1/')
  local credit=$(grep -A3 "\"$day\":" "$PROMPTS_FILE" | grep '"credit"' | sed 's/.*: "\(.*\)".*/\1/')
  local description=$(grep -A5 "\"$day\":" "$PROMPTS_FILE" | grep '"description"' | sed 's/.*: "\(.*\)".*/\1/')
  
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}JAN. $day${NC} - ${YELLOW}$title${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${NC}$description${NC}"
  echo ""
  echo -e "${BLUE}Credit: $credit${NC}"
  echo ""
  echo -e "Hashtags: ${YELLOW}#genuary #genuary2026 #genuary$day${NC}"
  echo ""
}

# Create a new day from template
new_day() {
  local day=$1
  
  if [[ "$day" == "today" ]]; then
    day=$(get_today)
  fi
  
  # Validate day
  if [[ ! "$day" =~ ^[0-9]+$ ]] || [[ "$day" -lt 1 ]] || [[ "$day" -gt 31 ]]; then
    echo -e "${RED}Error: Day must be between 1 and 31${NC}"
    return 1
  fi
  
  local day_padded=$(pad_day "$day")
  local day_dir="$DAYS_DIR/day$day_padded"
  
  # Check if already exists
  if [[ -d "$day_dir" ]]; then
    echo -e "${YELLOW}Day $day already exists at: $day_dir${NC}"
    echo -e "Edit the sketch at: ${CYAN}$day_dir/sketch.js${NC}"
    return 0
  fi
  
  # Get prompt info
  local title=$(grep -A3 "\"$day\":" "$PROMPTS_FILE" | grep '"title"' | sed 's/.*: "\(.*\)".*/\1/')
  local credit=$(grep -A3 "\"$day\":" "$PROMPTS_FILE" | grep '"credit"' | sed 's/.*: "\(.*\)".*/\1/')
  local description=$(grep -A5 "\"$day\":" "$PROMPTS_FILE" | grep '"description"' | sed 's/.*: "\(.*\)".*/\1/')
  
  # Create directory
  mkdir -p "$day_dir/output"
  
  # Copy and customize template
  sed -e "s/{{DAY}}/$day/g" \
      -e "s/{{DAY_PADDED}}/$day_padded/g" \
      -e "s/{{TITLE}}/$title/g" \
      -e "s/{{DESCRIPTION}}/$description/g" \
      -e "s/{{CREDIT}}/$credit/g" \
      "$TEMPLATE_DIR/index.html" > "$day_dir/index.html"
  
  sed -e "s/{{DAY}}/$day/g" \
      -e "s/{{DAY_PADDED}}/$day_padded/g" \
      -e "s/{{TITLE}}/$title/g" \
      -e "s/{{DESCRIPTION}}/$description/g" \
      "$TEMPLATE_DIR/sketch.js" > "$day_dir/sketch.js"
  
  echo ""
  echo -e "${GREEN}✓ Created day $day!${NC}"
  echo ""
  echo -e "  Directory: ${CYAN}$day_dir${NC}"
  echo -e "  Sketch:    ${CYAN}$day_dir/sketch.js${NC}"
  echo ""
  echo -e "${YELLOW}Prompt: $title${NC}"
  echo -e "$description"
  echo ""
  echo -e "Next steps:"
  echo -e "  1. Edit ${CYAN}sketch.js${NC} to create your art"
  echo -e "  2. Run ${GREEN}./harness.sh preview $day${NC} to see it"
  echo -e "  3. Run ${GREEN}./harness.sh export $day${NC} to save PNG"
  echo ""
}

# Preview a day in browser
preview_day() {
  local day=$1
  
  if [[ "$day" == "today" ]]; then
    day=$(get_today)
  fi
  
  local day_padded=$(pad_day "$day")
  local day_dir="$DAYS_DIR/day$day_padded"
  local html_file="$day_dir/index.html"
  
  if [[ ! -f "$html_file" ]]; then
    echo -e "${RED}Error: Day $day not found. Run './harness.sh new $day' first.${NC}"
    return 1
  fi
  
  echo -e "${GREEN}Opening day $day in browser...${NC}"
  open "$html_file"
}

# Export day as PNG (manual - opens browser with save instructions)
export_day() {
  local day=$1
  
  if [[ "$day" == "today" ]]; then
    day=$(get_today)
  fi
  
  local day_padded=$(pad_day "$day")
  local day_dir="$DAYS_DIR/day$day_padded"
  local html_file="$day_dir/index.html"
  
  if [[ ! -f "$html_file" ]]; then
    echo -e "${RED}Error: Day $day not found. Run './harness.sh new $day' first.${NC}"
    return 1
  fi
  
  echo ""
  echo -e "${GREEN}Opening day $day for export...${NC}"
  echo ""
  echo -e "To save your artwork:"
  echo -e "  1. Click the ${YELLOW}'Save PNG'${NC} button in the browser"
  echo -e "  2. Or press ${YELLOW}'S'${NC} key while viewing"
  echo -e "  3. Move the downloaded file to: ${CYAN}$day_dir/output/${NC}"
  echo ""
  
  open "$html_file"
}

# List all days and their status
list_days() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}GENUARY 2026 - Progress${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  local done_count=0
  local exported_count=0
  
  for day in {1..31}; do
    local day_padded=$(pad_day "$day")
    local day_dir="$DAYS_DIR/day$day_padded"
    local title=$(grep -A3 "\"$day\":" "$PROMPTS_FILE" | grep '"title"' | sed 's/.*: "\(.*\)".*/\1/')
    
    local status=""
    local status_color=""
    
    if [[ -d "$day_dir" ]]; then
      done_count=$((done_count + 1))
      if ls "$day_dir/output/"*.png 1> /dev/null 2>&1; then
        status="[✓ EXPORTED]"
        status_color="${GREEN}"
        exported_count=$((exported_count + 1))
      else
        status="[◐ STARTED]"
        status_color="${YELLOW}"
      fi
    else
      status="[ ]"
      status_color="${NC}"
    fi
    
    printf "  ${status_color}%-14s${NC} Day %2d: %s\n" "$status" "$day" "$title"
  done
  
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  Started: ${YELLOW}$done_count/31${NC}  |  Exported: ${GREEN}$exported_count/31${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

# Show help
show_help() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}GENUARY 2026 HARNESS${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "Usage: ${YELLOW}./harness.sh <command> [day]${NC}"
  echo ""
  echo -e "Commands:"
  echo -e "  ${GREEN}prompt${NC} <day|today>  Show the prompt for a day"
  echo -e "  ${GREEN}new${NC} <day|today>     Create a new day from template"
  echo -e "  ${GREEN}preview${NC} <day>       Open day in browser to preview"
  echo -e "  ${GREEN}export${NC} <day>        Open day for PNG export"
  echo -e "  ${GREEN}list${NC}                Show all days and progress"
  echo -e "  ${GREEN}help${NC}                Show this help message"
  echo ""
  echo -e "Examples:"
  echo -e "  ./harness.sh prompt today    # See today's prompt"
  echo -e "  ./harness.sh new 3           # Start day 3 (Fibonacci)"
  echo -e "  ./harness.sh preview 3       # Preview day 3"
  echo -e "  ./harness.sh list            # See your progress"
  echo ""
}

# Main command router
case "$1" in
  prompt)
    get_prompt "$2"
    ;;
  new)
    if [[ -z "$2" ]]; then
      echo -e "${RED}Error: Please specify a day number (1-31) or 'today'${NC}"
      exit 1
    fi
    new_day "$2"
    ;;
  preview)
    if [[ -z "$2" ]]; then
      echo -e "${RED}Error: Please specify a day number (1-31)${NC}"
      exit 1
    fi
    preview_day "$2"
    ;;
  export)
    if [[ -z "$2" ]]; then
      echo -e "${RED}Error: Please specify a day number (1-31)${NC}"
      exit 1
    fi
    export_day "$2"
    ;;
  list)
    list_days
    ;;
  help|--help|-h|"")
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac
